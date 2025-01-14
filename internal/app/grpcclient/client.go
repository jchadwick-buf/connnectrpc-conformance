// Copyright 2023-2024 The Connect Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package grpcclient

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"io"
	"net"
	"path/filepath"
	"runtime"
	"strconv"
	"sync"
	"sync/atomic"
	"time"

	"connectrpc.com/conformance/internal"
	conformancev1 "connectrpc.com/conformance/internal/gen/proto/go/connectrpc/conformance/v1"
	"golang.org/x/sync/semaphore"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/encoding/gzip"
)

// Run runs the client according to a client config read from the 'in' reader. The result of the run
// is written to the 'out' writer, including any errors encountered during the actual run. Any error
// returned from this function is indicative of an issue with the reader or writer and should not be related
// to the actual run.
func Run(ctx context.Context, args []string, inReader io.ReadCloser, outWriter, _ io.WriteCloser) (retErr error) {
	flags := flag.NewFlagSet(args[0], flag.ContinueOnError)
	json := flags.Bool("json", false, "whether to use the JSON format for marshaling / unmarshaling messages")
	parallel := flags.Uint("p", uint(runtime.GOMAXPROCS(0))*4, "the number of parallel RPCs to issue")
	showVersion := flags.Bool("version", false, "show version and exit")

	if err := flags.Parse(args[1:]); err != nil {
		return err
	}
	if *showVersion {
		_, _ = fmt.Fprintf(outWriter, "%s %s\n", filepath.Base(args[0]), internal.Version)
		return nil
	}
	if flags.NArg() != 0 {
		return errors.New("this command does not accept any positional arguments")
	}
	if *parallel == 0 {
		return errors.New("invalid parallelism; must be greater than zero")
	}

	codec := internal.NewCodec(*json)
	decoder := codec.NewDecoder(inReader)
	encoder := codec.NewEncoder(outWriter)
	var encoderMu sync.Mutex

	var failure atomic.Pointer[error]
	defer func() {
		// if we're about to return nil error, but a goroutine reported
		// a failure, return that failure as the error
		if errPtr := failure.Load(); errPtr != nil && retErr == nil {
			retErr = *errPtr
		}
	}()

	var wg sync.WaitGroup
	defer wg.Wait()
	sema := semaphore.NewWeighted(int64(*parallel))

	for {
		var req conformancev1.ClientCompatRequest
		err := decoder.DecodeNext(&req)
		if err != nil {
			if errors.Is(err, io.EOF) {
				return nil
			}
			return err
		}

		if err := sema.Acquire(ctx, 1); err != nil {
			return err
		}
		if errPtr := failure.Load(); errPtr != nil {
			// If there's already been a terminal failure, don't spawn
			// anymore goroutines.
			return *errPtr
		}

		wg.Add(1)
		go func() {
			defer wg.Done()
			defer sema.Release(1)

			result, err := invoke(ctx, &req)

			// Build the result for the out writer.
			resp := &conformancev1.ClientCompatResponse{
				TestName: req.TestName,
			}
			// If an error was returned, it was a runtime / unexpected internal error so
			// the written response should contain an error result, not a response with
			// any RPC information
			if err != nil {
				resp.Result = &conformancev1.ClientCompatResponse_Error{
					Error: &conformancev1.ClientErrorResult{
						Message: err.Error(),
					},
				}
			} else {
				resp.Result = &conformancev1.ClientCompatResponse_Response{
					Response: result,
				}
			}

			// Marshal the response and write the output
			func() {
				encoderMu.Lock()
				defer encoderMu.Unlock()
				if err := encoder.Encode(resp); err != nil {
					failure.CompareAndSwap(nil, &err)
				}
			}()
		}()
	}
}

// Invokes a ClientCompatRequest, returning either the result of the invocation or an error. The error
// returned from this function indicates a runtime/unexpected internal error and is not indicative of a
// gRPC error returned from calling an RPC. Any error (i.e. a gRPC error) that _is_ returned from
// the actual RPC invocation will be present in the returned ClientResponseResult.
func invoke(ctx context.Context, req *conformancev1.ClientCompatRequest) (*conformancev1.ClientResponseResult, error) {
	transportCredentials := insecure.NewCredentials()
	dialOpts := []grpc.DialOption{
		grpc.WithTransportCredentials(transportCredentials),
		grpc.WithBlock(),
		grpc.WithReturnConnectionError(),
		grpc.WithUnaryInterceptor(userAgentUnaryClientInterceptor),
		grpc.WithStreamInterceptor(userAgentStreamClientInterceptor),
	}
	if req.Compression == conformancev1.Compression_COMPRESSION_GZIP {
		dialOpts = append(dialOpts, grpc.WithDefaultCallOptions(grpc.UseCompressor(gzip.Name)))
	}

	dialCtx, dialCancel := context.WithTimeout(ctx, 5*time.Second)
	defer dialCancel()
	clientConn, err := grpc.DialContext(
		dialCtx,
		net.JoinHostPort(req.Host, strconv.FormatUint(uint64(req.Port), 10)),
		dialOpts...,
	)
	if err != nil {
		return nil, err
	}

	switch req.GetService() {
	case internal.ConformanceServiceName:
		return newInvoker(clientConn).Invoke(ctx, req)
	default:
		return nil, fmt.Errorf("service name %s is not a valid service", req.GetService())
	}
}
