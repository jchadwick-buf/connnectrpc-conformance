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

package connectconformance

import (
	"errors"
	"fmt"
	"math"
	"path"
	"sort"
	"strings"

	"connectrpc.com/conformance/internal"
	conformancev1 "connectrpc.com/conformance/internal/gen/proto/go/connectrpc/conformance/v1"
	"connectrpc.com/conformance/internal/gen/proto/go/connectrpc/conformance/v1/conformancev1connect"
	"connectrpc.com/connect"
	"github.com/bufbuild/protoyaml-go"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/reflect/protoreflect"
	"google.golang.org/protobuf/types/known/anypb"
)

const (
	// Note that we always use a larger limit on the client so that when
	// we test the server limit, even when close to the server's limit, the
	// response (which echoes back the request data) won't exceed client limit.
	clientReceiveLimit = 1024 * 1024 // 1 MB
	serverReceiveLimit = 200 * 1024  // 200 KB

	// these are inserted into test case permutation names for the permutations
	// of a test case that use the grpc-go implementation of a reference client
	// or server.
	grpcImplMarker       = "(grpc impls)"
	grpcClientImplMarker = "(grpc client impl)"
	grpcServerImplMarker = "(grpc server impl)"
)

//nolint:gochecknoglobals
var (
	allProtocols    = allValues[conformancev1.Protocol](conformancev1.Protocol_name)
	allHTTPVersions = allValues[conformancev1.HTTPVersion](conformancev1.HTTPVersion_name)
	allCodecs       = allValues[conformancev1.Codec](conformancev1.Codec_name)
	allCompressions = allValues[conformancev1.Compression](conformancev1.Compression_name)
	allStreamTypes  = allValues[conformancev1.StreamType](conformancev1.StreamType_name)
)

// testCaseLibrary is the set of all applicable test cases for a run
// of the conformance tests.
type testCaseLibrary struct {
	// Map of test case name to the test case definition. This has distinct entries
	// for each test permutation (so a single test case from a YAML file could be
	// turn into multiple entries in this map). This does NOT include permutations
	// that run against the gRPC implementations.
	testCases map[string]*conformancev1.TestCase
	// Groupings of test cases, keyed by relevant server configuration. Like above,
	// this does not include test case permutations that run against the gRPC
	// implementations.
	casesByServer map[serverInstance][]*conformancev1.TestCase
	// Map of full test case names to original name defined in the YAML file. The
	// keys include the name of the enclosing suite as well as permutation properties.
	// The values are just the simple names, exactly as defined in YAML.
	testCaseNames map[string]string
}

// newTestCaseLibrary creates a new resolved set of test cases by applying
// the given test suite configuration to the given config cases that are
// applicable to the current run of conformance tests.
func newTestCaseLibrary(
	allSuites map[string]*conformancev1.TestSuite,
	configCases []configCase,
	mode conformancev1.TestSuite_TestMode,
) (*testCaseLibrary, error) {
	configCaseSet := make(map[configCase]struct{}, len(configCases))
	for _, c := range configCases {
		configCaseSet[c] = struct{}{}
	}
	lib := &testCaseLibrary{
		testCases:     map[string]*conformancev1.TestCase{},
		testCaseNames: map[string]string{},
	}
	suitesIndex := make(map[string]string, len(allSuites))
	for file, suite := range allSuites {
		if suite.Name == "" {
			return nil, fmt.Errorf("%s defines a suite with no name", file)
		}
		if len(suite.TestCases) == 0 {
			return nil, fmt.Errorf("%s defines a suite %s that has no test cases", file, suite.Name)
		}
		if existingFile, exists := suitesIndex[suite.Name]; exists {
			return nil, fmt.Errorf("both %s and %s define a suite named %s", file, existingFile, suite.Name)
		}
		suitesIndex[suite.Name] = file
		if suite.Mode != conformancev1.TestSuite_TEST_MODE_UNSPECIFIED && suite.Mode != mode {
			continue // skip it
		}
		if err := lib.expandSuite(suite, configCaseSet); err != nil {
			return nil, err
		}
	}

	if len(lib.testCases) == 0 {
		return nil, errors.New("no test cases apply to current configuration")
	}
	if err := lib.populateExpectedResponses(); err != nil {
		return nil, err
	}
	lib.groupTestCases()
	return lib, nil
}

func (lib *testCaseLibrary) expandSuite(suite *conformancev1.TestSuite, configCases map[configCase]struct{}) error {
	if suite.ReliesOnTlsClientCerts && !suite.ReliesOnTls {
		return fmt.Errorf("suite %q is misconfigured: it relies on TLS client certs but not TLS", suite.Name)
	}
	if suite.ReliesOnConnectGet && !only(suite.RelevantProtocols, conformancev1.Protocol_PROTOCOL_CONNECT) {
		return fmt.Errorf("suite %q is misconfigured: it relies on Connect GET support, but has unexpected relevant protocols: %v", suite.Name, suite.RelevantProtocols)
	}
	if suite.ConnectVersionMode == conformancev1.TestSuite_CONNECT_VERSION_MODE_IGNORE && !only(suite.RelevantProtocols, conformancev1.Protocol_PROTOCOL_CONNECT) {
		return fmt.Errorf("suite %q is misconfigured: it ignores Connect Version headers, but has unexpected relevant protocols: %v", suite.Name, suite.RelevantProtocols)
	}
	if suite.ConnectVersionMode == conformancev1.TestSuite_CONNECT_VERSION_MODE_REQUIRE && !only(suite.RelevantProtocols, conformancev1.Protocol_PROTOCOL_CONNECT) {
		return fmt.Errorf("suite %q is misconfigured: it requires Connect Version headers, but has unexpected relevant protocols: %v", suite.Name, suite.RelevantProtocols)
	}
	protocols := suite.RelevantProtocols
	if len(protocols) == 0 {
		protocols = allProtocols
	}
	for _, protocol := range protocols {
		httpVersions := suite.RelevantHttpVersions
		if len(httpVersions) == 0 {
			httpVersions = allHTTPVersions
		}
		for _, httpVersion := range httpVersions {
			tlsCases := []bool{true, false}
			if suite.ReliesOnTls {
				tlsCases = []bool{true} // can't run these cases w/out TLS
			}
			for _, tlsCase := range tlsCases {
				codecs := suite.RelevantCodecs
				if len(codecs) == 0 {
					codecs = allCodecs
				}
				for _, codec := range codecs {
					compressions := suite.RelevantCompressions
					if len(compressions) == 0 {
						compressions = allCompressions
					}
					for _, compression := range compressions {
						for _, streamType := range allStreamTypes {
							cfgCase := configCase{
								Version:                httpVersion,
								Protocol:               protocol,
								Codec:                  codec,
								Compression:            compression,
								StreamType:             streamType,
								UseTLS:                 tlsCase,
								UseTLSClientCerts:      suite.ReliesOnTlsClientCerts,
								UseConnectGET:          suite.ReliesOnConnectGet,
								ConnectVersionMode:     suite.ConnectVersionMode,
								UseMessageReceiveLimit: suite.ReliesOnMessageReceiveLimit,
							}
							if _, ok := configCases[cfgCase]; ok {
								namePrefix := generateTestCasePrefix(suite, cfgCase)
								if err := lib.expandCases(cfgCase, namePrefix, suite.TestCases); err != nil {
									return fmt.Errorf("failed to expand test cases for suite %s: %w", suite.Name, err)
								}
							}
						}
					}
				}
			}
		}
	}
	return nil
}

func (lib *testCaseLibrary) expandCases(cfgCase configCase, namePrefix []string, testCases []*conformancev1.TestCase) error {
	for i, testCase := range testCases {
		if testCase.Request.TestName == "" {
			return fmt.Errorf("test case #%d: test case has no name", i+1)
		}
		if testCase.Request.StreamType == conformancev1.StreamType_STREAM_TYPE_UNSPECIFIED {
			return fmt.Errorf("test case #%d: test %s has no stream type specified", i+1, testCase.Request.TestName)
		}
		if testCase.Request.StreamType != cfgCase.StreamType {
			continue
		}
		if testCase.Request.GetService() == "" {
			if testCase.Request.GetMethod() == "" {
				serviceName := conformancev1connect.ConformanceServiceName
				testCase.Request.Service = &serviceName

				methodName := ""
				switch testCase.Request.StreamType {
				case conformancev1.StreamType_STREAM_TYPE_UNARY:
					methodName = "Unary"
				case conformancev1.StreamType_STREAM_TYPE_CLIENT_STREAM:
					methodName = "ClientStream"
				case conformancev1.StreamType_STREAM_TYPE_SERVER_STREAM:
					methodName = "ServerStream"
				case conformancev1.StreamType_STREAM_TYPE_HALF_DUPLEX_BIDI_STREAM,
					conformancev1.StreamType_STREAM_TYPE_FULL_DUPLEX_BIDI_STREAM:
					methodName = "BidiStream"
				}
				testCase.Request.Method = &methodName
			} else {
				return fmt.Errorf("test case #%d: test name %s has a method specified but no service", i+1, testCase.Request.TestName)
			}
		} else {
			// If service was specified, but method was not, return an error.
			if testCase.Request.GetMethod() == "" {
				return fmt.Errorf("test case #%d: test name %s has a service specified but no method", i+1, testCase.Request.TestName)
			}
		}
		simpleName := testCase.Request.TestName
		fullName := path.Join(append(namePrefix, simpleName)...)
		if _, exists := lib.testCases[fullName]; exists {
			return fmt.Errorf("test case library includes duplicate definition for %v", fullName)
		}
		testCase := proto.Clone(testCase).(*conformancev1.TestCase) //nolint:errcheck,forcetypeassert
		testCase.Request.TestName = fullName
		if cfgCase.UseTLS {
			// to be replaced with actual cert provided by server
			testCase.Request.ServerTlsCert = []byte("PLACEHOLDER")
			if cfgCase.UseTLSClientCerts {
				testCase.Request.ClientTlsCreds = &conformancev1.ClientCompatRequest_TLSCreds{
					Key:  []byte("PLACEHOLDER"),
					Cert: []byte("PLACEHOLDER"),
				}
			} else {
				testCase.Request.ClientTlsCreds = nil
			}
		} else {
			testCase.Request.ServerTlsCert = nil
			testCase.Request.ClientTlsCreds = nil
		}
		testCase.Request.HttpVersion = cfgCase.Version
		testCase.Request.Protocol = cfgCase.Protocol
		testCase.Request.Codec = cfgCase.Codec
		testCase.Request.Compression = cfgCase.Compression
		// We always set this. If client-under-test does not support it, we just
		// won't run the test cases that verify that it's enforced.
		testCase.Request.MessageReceiveLimit = clientReceiveLimit
		lib.testCases[fullName] = testCase
		lib.testCaseNames[fullName] = simpleName
	}
	return nil
}

func (lib *testCaseLibrary) populateExpectedResponses() error {
	for _, testCase := range lib.testCases {
		if err := populateExpectedResponse(testCase); err != nil {
			return fmt.Errorf("failed to compute expected response for test case %q: %w",
				testCase.Request.TestName, err)
		}
	}
	return nil
}

func (lib *testCaseLibrary) groupTestCases() {
	lib.casesByServer = map[serverInstance][]*conformancev1.TestCase{}
	for _, testCase := range lib.testCases {
		svr := serverInstanceForCase(testCase)
		lib.casesByServer[svr] = append(lib.casesByServer[svr], testCase)
	}
}

func (lib *testCaseLibrary) allPermutations(clientIsGRPCImpl, serverIsGRPCImpl bool) []*conformancev1.TestCase {
	testCaseSlice := make([]*conformancev1.TestCase, 0, len(lib.testCases))
	for _, testCase := range lib.testCases {
		testCaseSlice = append(testCaseSlice, testCase)
	}
	results := testCaseSlice
	if clientIsGRPCImpl {
		// Count the cases where we run grpc-go client against server under test.
		results = append(results, lib.filterGRPCImplTestCases(testCaseSlice, true, false)...)
	}
	if serverIsGRPCImpl {
		// Count the cases where we run client under test against grpc-go server.
		results = append(results, lib.filterGRPCImplTestCases(testCaseSlice, false, true)...)
	}
	if clientIsGRPCImpl && serverIsGRPCImpl {
		// Count the cases where we run grpc-go client against grpc-go server.
		// (This is only done from a unit test. The CLI doesn't actually allow this.)
		results = append(results, lib.filterGRPCImplTestCases(testCaseSlice, true, true)...)
	}
	return results
}

func (lib *testCaseLibrary) filterGRPCImplTestCases(testCases []*conformancev1.TestCase, clientIsGRPCImpl, serverIsGRPCImpl bool) []*conformancev1.TestCase {
	if !clientIsGRPCImpl && !serverIsGRPCImpl {
		return testCases
	}

	// The gRPC reference impls do not support everything that the main reference impls do.
	// So we must filter away any test cases that aren't applicable to the gRPC impls.

	filtered := make([]*conformancev1.TestCase, 0, len(testCases))
	for _, testCase := range testCases {
		// Client only supports gRPC protocol. Server also supports gRPC-Web.
		if clientIsGRPCImpl && testCase.Request.Protocol != conformancev1.Protocol_PROTOCOL_GRPC ||
			testCase.Request.Protocol == conformancev1.Protocol_PROTOCOL_CONNECT {
			continue
		}

		if testCase.Request.Protocol == conformancev1.Protocol_PROTOCOL_GRPC_WEB {
			// grpc-web supports HTTP/1 and HTTP/2
			switch testCase.Request.HttpVersion {
			case conformancev1.HTTPVersion_HTTP_VERSION_1, conformancev1.HTTPVersion_HTTP_VERSION_2:
			default:
				continue
			}
		} else if testCase.Request.HttpVersion != conformancev1.HTTPVersion_HTTP_VERSION_2 {
			// but grpc only supports HTTP/2
			continue
		}

		if testCase.Request.Codec != conformancev1.Codec_CODEC_PROTO {
			continue
		}
		if testCase.Request.Compression != conformancev1.Compression_COMPRESSION_IDENTITY &&
			testCase.Request.Compression != conformancev1.Compression_COMPRESSION_GZIP {
			continue
		}

		if len(testCase.Request.ServerTlsCert) > 0 {
			continue
		}

		if testCase.Request.RawRequest != nil && clientIsGRPCImpl {
			continue
		}
		if hasRawResponse(testCase.Request.RequestMessages) && serverIsGRPCImpl {
			continue
		}

		filteredCase := proto.Clone(testCase).(*conformancev1.TestCase) //nolint:errcheck,forcetypeassert
		baseName := lib.testCaseNames[filteredCase.Request.TestName]
		filteredCase.Request.TestName = addGRPCMarkerToName(filteredCase.Request.TestName, baseName, clientIsGRPCImpl, serverIsGRPCImpl)
		filtered = append(filtered, filteredCase)
	}
	return filtered
}

type testCaseFilter struct {
	run, noRun *testTrie
}

func newFilter(run, noRun *testTrie) *testCaseFilter {
	if run == nil && noRun == nil {
		return nil
	}
	return &testCaseFilter{run: run, noRun: noRun}
}

func (f *testCaseFilter) accept(testCase *conformancev1.TestCase) bool {
	if f == nil {
		return true
	}
	if f.run != nil && !f.run.matchPattern(testCase.Request.TestName) {
		return false
	}
	if f.noRun != nil && f.noRun.matchPattern(testCase.Request.TestName) {
		return false
	}
	return true
}

func (f *testCaseFilter) apply(testCases []*conformancev1.TestCase) []*conformancev1.TestCase {
	if f == nil || (f.run == nil && f.noRun == nil) {
		return testCases // no filtering
	}
	results := make([]*conformancev1.TestCase, 0, len(testCases))
	for _, tc := range testCases {
		if f.accept(tc) {
			results = append(results, tc)
		}
	}
	return results
}

// serverInstance identifies the properties of a server process, so tests
// can be grouped by target server process.
type serverInstance struct {
	protocol          conformancev1.Protocol
	httpVersion       conformancev1.HTTPVersion
	useTLS            bool
	useTLSClientCerts bool
}

func serverInstanceForCase(testCase *conformancev1.TestCase) serverInstance {
	return serverInstance{
		protocol:          testCase.Request.Protocol,
		httpVersion:       testCase.Request.HttpVersion,
		useTLS:            len(testCase.Request.ServerTlsCert) > 0,
		useTLSClientCerts: testCase.Request.ClientTlsCreds != nil,
	}
}

type unaryResponseDefiner interface {
	GetResponseDefinition() *conformancev1.UnaryResponseDefinition
	proto.Message
}

type streamResponseDefiner interface {
	GetResponseDefinition() *conformancev1.StreamResponseDefinition
}

func addGRPCMarkerToName(fullName, simpleName string, clientIsGRPCImpl, serverIsGRPCImpl bool) string {
	prefix := strings.TrimSuffix(fullName, simpleName)
	var elem string
	switch {
	case clientIsGRPCImpl && serverIsGRPCImpl:
		elem = grpcImplMarker
	case clientIsGRPCImpl:
		elem = grpcClientImplMarker
	case serverIsGRPCImpl:
		elem = grpcServerImplMarker
	}
	return prefix + elem + "/" + simpleName
}

// parseTestSuites processes the given file contents. The given map is keyed
// by test file name. Each entry's value is the contents of the named file.
// The given argument often represents the embedded test suite data. Also
// see testsuites.LoadTestSuites.
func parseTestSuites(testFileData map[string][]byte) (map[string]*conformancev1.TestSuite, error) {
	allSuites := make(map[string]*conformancev1.TestSuite, len(testFileData))
	for testFilePath, data := range testFileData {
		opts := protoyaml.UnmarshalOptions{
			Path: testFilePath,
		}
		suite := &conformancev1.TestSuite{}
		if err := opts.Unmarshal(data, suite); err != nil {
			return nil, internal.EnsureFileName(err, testFilePath)
		}
		for _, testCase := range suite.TestCases {
			if testCase.Request.RawRequest != nil && suite.Mode != conformancev1.TestSuite_TEST_MODE_SERVER {
				return nil, fmt.Errorf("%s: test case %q has raw request, but that is only allowed when mode is TEST_MODE_SERVER",
					testFilePath, testCase.Request.TestName)
			}
			if hasRawResponse(testCase.Request.RequestMessages) && suite.Mode != conformancev1.TestSuite_TEST_MODE_CLIENT {
				return nil, fmt.Errorf("%s: test case %q has raw response, but that is only allowed when mode is TEST_MODE_CLIENT",
					testFilePath, testCase.Request.TestName)
			}
			if hasRawResponse(testCase.Request.RequestMessages) && testCase.ExpectedResponse == nil {
				return nil, fmt.Errorf("%s: test case %q has raw response, but does not specify an explicit expected response",
					testFilePath, testCase.Request.TestName)
			}
			// The expand request directive uses the proto codec for size calculations, so it doesn't make sense to test with other codecs
			if len(testCase.ExpandRequests) > 0 && (len(suite.RelevantCodecs) > 1 || !hasCodec(suite.RelevantCodecs, conformancev1.Codec_CODEC_PROTO)) {
				return nil, fmt.Errorf("%s: test case %q specifies expand requests directive, but includes codecs other than CODEC_PROTO",
					testFilePath, testCase.Request.TestName)
			}
			if err := expandRequestData(testCase); err != nil {
				return nil, fmt.Errorf("%s: failed to expand request sizes as directed for test case %q: %w",
					testFilePath, testCase.Request.TestName, err)
			}
		}
		allSuites[testFilePath] = suite
	}
	return allSuites, nil
}

// expandRequestData expands the request_data field of RPC requests in the
// given test case, per directives in the expand_requests test case field.
func expandRequestData(testCase *conformancev1.TestCase) error {
	if len(testCase.ExpandRequests) == 0 {
		return nil // nothing to do...
	}

	if len(testCase.ExpandRequests) > len(testCase.Request.RequestMessages) {
		return fmt.Errorf("expand directives indicate %d messages, but there are only %d requests",
			len(testCase.ExpandRequests), len(testCase.Request.RequestMessages))
	}

	for i, expandSz := range testCase.ExpandRequests {
		if expandSz.SizeRelativeToLimit == nil {
			// Absent size means do not expand this one.
			continue
		}
		totalSize := serverReceiveLimit + int64(expandSz.GetSizeRelativeToLimit())
		if totalSize < 0 || totalSize > math.MaxUint32 {
			return fmt.Errorf("expand directive #%d (%d) results in an invalid request size: %d",
				i+1, expandSz.GetSizeRelativeToLimit(), totalSize)
		}
		concreteReq, err := testCase.Request.RequestMessages[i].UnmarshalNew()
		if err != nil {
			return fmt.Errorf("request message #%d: %w", i+1, err)
		}
		reflectReq := concreteReq.ProtoReflect()
		field := reflectReq.Descriptor().Fields().ByName("request_data")
		if field == nil {
			return fmt.Errorf("request message #%d: message type %s has no request_data field for padding",
				i+1, reflectReq.Descriptor().FullName())
		}
		if field.Cardinality() != protoreflect.Optional || field.Kind() != protoreflect.BytesKind {
			return fmt.Errorf("request message #%d: message type %s has invalid request_data field",
				i+1, reflectReq.Descriptor().FullName())
		}

		var adjustCount int
		for {
			size := proto.Size(concreteReq)
			delta := totalSize - int64(size)
			if delta == 0 {
				// it's the right size
				break
			}
			if adjustCount >= 2 {
				// Oof. If we have to adjust it more than 2x, then we're at a weird boundary
				// condition that can't easily be expanded to the exact size. This is highly
				// unlikely, but can happen if adding the one byte of padding causes the data
				// length to suddenly require one more byte to encode as a varint. In that
				// case, adding one byte of data adds two bytes to the size. So if we were
				// only one byte away from the desired size, the padded size pushes us one
				// byte over.
				return fmt.Errorf("request message #%d: can't pad to exactly %d bytes; closest we can get is %d",
					i+1, totalSize, size)
			}
			// TODO: Do we care if the padding is highly compressible? We'll assume not
			//       and use zero values for now.
			bytesVal := reflectReq.Get(field).Bytes()
			if delta > 0 {
				padding := make([]byte, delta)
				bytesVal = append(bytesVal, padding...)
			} else {
				bytesVal = bytesVal[:len(bytesVal)+int(delta)]
			}
			reflectReq.Set(field, protoreflect.ValueOfBytes(bytesVal))
			adjustCount++
		}

		if err := testCase.Request.RequestMessages[i].MarshalFrom(concreteReq); err != nil {
			return fmt.Errorf("request message #%d: %w", i+1, err)
		}
	}
	return nil
}

// populateExpectedResponse populates the response we expected to get back from the server
// by examining the requests we sent.
func populateExpectedResponse(testCase *conformancev1.TestCase) error {
	// If an expected response was already provided, return and use that.
	// This allows for overriding this function with explicit values in the yaml file.
	if testCase.ExpectedResponse != nil {
		return nil
	}

	// TODO - This is just a temporary constraint to protect against panics for now.
	// Eventually, we want to be able to test client and bidi streams where there are no request messages.
	// The potential plan is for server impls to produce (and the code below to expect) a single response
	// message in this situation, where the response data value is some fixed string (such as "no response definition")
	// and whose request info will still be present, but we expect it to indicate zero request messages.
	if len(testCase.Request.RequestMessages) == 0 {
		testCase.ExpectedResponse = &conformancev1.ClientResponseResult{}
		return nil
	}

	switch testCase.Request.StreamType {
	case conformancev1.StreamType_STREAM_TYPE_FULL_DUPLEX_BIDI_STREAM,
		conformancev1.StreamType_STREAM_TYPE_HALF_DUPLEX_BIDI_STREAM,
		conformancev1.StreamType_STREAM_TYPE_SERVER_STREAM:
		return populateExpectedStreamResponse(testCase)

	case conformancev1.StreamType_STREAM_TYPE_UNARY,
		conformancev1.StreamType_STREAM_TYPE_CLIENT_STREAM:
		return populateExpectedUnaryResponse(testCase)

	case conformancev1.StreamType_STREAM_TYPE_UNSPECIFIED:
		return errors.New("stream type is required")
	default:
		return fmt.Errorf("stream type %s is not supported", testCase.Request.StreamType)
	}
}

// Converts a pointer to a uint32 value into a pointer to an int64.
// If the pointer is nil, function returns nil.
func convertToInt64Ptr(num *uint32) *int64 {
	if num == nil {
		return nil
	}
	return proto.Int64(int64(*num))
}

func hasCodec(codecs []conformancev1.Codec, target conformancev1.Codec) bool {
	for _, c := range codecs {
		if c == target {
			return true
		}
	}
	return false
}

func hasRawResponse(reqs []*anypb.Any) bool {
	if len(reqs) == 0 {
		return false
	}
	msg, err := reqs[0].UnmarshalNew()
	if err != nil {
		return false // we'll deal with this error later
	}
	switch msg := msg.(type) {
	case unaryResponseDefiner:
		if msg.GetResponseDefinition().GetRawResponse() != nil {
			return true
		}
	case streamResponseDefiner:
		if msg.GetResponseDefinition().GetRawResponse() != nil {
			return true
		}
	}
	return false
}

// populates the expected response for a unary test case.
func populateExpectedUnaryResponse(testCase *conformancev1.TestCase) error {
	req := testCase.Request.RequestMessages[0]

	// First, find the response definition that the client instructed the server to return
	concreteReq, err := req.UnmarshalNew()
	if err != nil {
		return err
	}

	definer, ok := concreteReq.(unaryResponseDefiner)
	if !ok {
		return fmt.Errorf("%T is not a unary test case", concreteReq)
	}

	reqInfo := &conformancev1.ConformancePayload_RequestInfo{
		RequestHeaders: testCase.Request.RequestHeaders,
		Requests:       testCase.Request.RequestMessages,
		TimeoutMs:      convertToInt64Ptr(testCase.Request.TimeoutMs),
	}

	// If this is a GET test, then the request should be marshalled and in the query params
	if testCase.Request.UseGetHttpMethod {
		var encoding string
		if testCase.Request.Codec == conformancev1.Codec_CODEC_JSON {
			encoding = "json"
		} else {
			encoding = "proto"
		}
		// We intentionally exclude the "message" query param: the RPC response, which
		// echos back the request data, will suffice to check that. Also, we can't
		// indicate a specific sequence of bytes to expect for "message" because there
		// isn't a *canonical* encoding for protobuf nor is there necessarily a
		// canonical encoding of compressed messages. So we just verify that it has
		// the required "encoding" parameter and then will check the echoed-back request
		// to verify that the message was otherwise correctly encoded (by virtue of the
		// fact that it could be correctly decoded by the server).
		//
		// We also exclude the "base64" parameter, allowing implementations flexibility
		// on when to use it. It's mainly valuable to use for binary data, where the
		// alternative (to just rely on the percent-encoding of URL query strings) will
		// be more verbose and lead to a larger request line (potentially one that is
		// too long to fit in a URI).
		reqInfo.ConnectGetInfo = &conformancev1.ConformancePayload_ConnectGetInfo{
			QueryParams: []*conformancev1.Header{
				{
					Name:  "encoding",
					Value: []string{encoding},
				},
				{
					Name:  "connect",
					Value: []string{"v1"},
				},
			},
		}
	}

	def := definer.GetResponseDefinition()

	if def == nil {
		testCase.ExpectedResponse = &conformancev1.ClientResponseResult{
			Payloads: []*conformancev1.ConformancePayload{
				{
					RequestInfo: reqInfo,
				},
			},
		}
		return nil
	}

	// Server should have echoed back all specified headers and trailers
	expected := &conformancev1.ClientResponseResult{
		ResponseHeaders:  def.ResponseHeaders,
		ResponseTrailers: def.ResponseTrailers,
	}

	switch respType := def.Response.(type) {
	case *conformancev1.UnaryResponseDefinition_Error:
		// If an error was specified, it should be returned in the response
		expected.Error = respType.Error

		// Unary responses that return an error should have the request info
		// in the error details
		reqInfoAny, err := anypb.New(reqInfo)
		if err != nil {
			return connect.NewError(connect.CodeInternal, err)
		}
		respType.Error.Details = append(respType.Error.Details, reqInfoAny)
	case *conformancev1.UnaryResponseDefinition_ResponseData, nil:
		// If response data was specified for the response (or nothing at all),
		// the server should echo back the request message and headers in the response
		payload := &conformancev1.ConformancePayload{
			RequestInfo: reqInfo,
		}
		// If response data was specified for the response, it should be returned
		if respType, ok := respType.(*conformancev1.UnaryResponseDefinition_ResponseData); ok {
			payload.Data = respType.ResponseData
		}
		expected.Payloads = []*conformancev1.ConformancePayload{payload}
	default:
		return fmt.Errorf("provided UnaryRequest.Response has an unexpected type %T", respType)
	}

	testCase.ExpectedResponse = expected
	return nil
}

// populates the expected response for a streaming test case.
func populateExpectedStreamResponse(testCase *conformancev1.TestCase) error {
	req := testCase.Request.RequestMessages[0]
	// First, find the response definition that the client instructed the
	// server to return
	concreteReq, err := req.UnmarshalNew()
	if err != nil {
		return err
	}

	definer, ok := concreteReq.(streamResponseDefiner)
	if !ok {
		return fmt.Errorf(
			"TestCase %s contains a request message of type %T, which is not a streaming request",
			testCase.Request.TestName,
			concreteReq,
		)
	}

	def := definer.GetResponseDefinition()
	// Streaming endpoints don't 'return' a response and instead send responses
	// to a client via sending on a stream. So, if no responses are specified in
	// the request, the endpoints won't send anything outbound.
	// As a result, streaming endpoints simply expect an empty
	// ClientResponseResult if no response definition is provided
	if def == nil {
		testCase.ExpectedResponse = &conformancev1.ClientResponseResult{}
		return nil
	}

	// Server should have echoed back all specified headers, trailers, and errors
	expected := &conformancev1.ClientResponseResult{
		ResponseHeaders:  def.ResponseHeaders,
		ResponseTrailers: def.ResponseTrailers,
		Error:            def.Error,
	}

	// There should be one payload for every ResponseData the client specified
	expected.Payloads = make([]*conformancev1.ConformancePayload, len(def.ResponseData))

	// The request specified an immediate error with no response
	// Build a RequestInfo message and append it to the error details
	if len(def.ResponseData) == 0 && expected.Error != nil {
		reqInfo := &conformancev1.ConformancePayload_RequestInfo{
			RequestHeaders: testCase.Request.RequestHeaders,
			Requests:       testCase.Request.RequestMessages,
			TimeoutMs:      convertToInt64Ptr(testCase.Request.TimeoutMs),
		}
		reqInfoAny, err := anypb.New(reqInfo)
		if err != nil {
			return connect.NewError(connect.CodeInternal, err)
		}
		expected.Error.Details = append(expected.Error.Details, reqInfoAny)
	}

	for idx, data := range def.ResponseData {
		expected.Payloads[idx] = &conformancev1.ConformancePayload{
			Data: data,
		}
		switch testCase.Request.StreamType { //nolint:exhaustive
		case conformancev1.StreamType_STREAM_TYPE_SERVER_STREAM,
			conformancev1.StreamType_STREAM_TYPE_HALF_DUPLEX_BIDI_STREAM:
			// For server streams and half duplex bidi streams, all request information
			// specified should only be echoed back in the first response
			if idx == 0 {
				expected.Payloads[idx].RequestInfo = &conformancev1.ConformancePayload_RequestInfo{
					RequestHeaders: testCase.Request.RequestHeaders,
					Requests:       testCase.Request.RequestMessages,
					TimeoutMs:      convertToInt64Ptr(testCase.Request.TimeoutMs),
				}
			}
		case conformancev1.StreamType_STREAM_TYPE_FULL_DUPLEX_BIDI_STREAM:
			// For a full duplex stream, the first request should be echoed back in the first
			// payload. The second should be echoed back in the second payload, etc. (i.e. a ping pong interaction)
			expected.Payloads[idx].RequestInfo = &conformancev1.ConformancePayload_RequestInfo{
				Requests: []*anypb.Any{testCase.Request.RequestMessages[idx]},
			}
			if idx == 0 {
				expected.Payloads[idx].RequestInfo.RequestHeaders = testCase.Request.RequestHeaders
				expected.Payloads[idx].RequestInfo.TimeoutMs = convertToInt64Ptr(testCase.Request.TimeoutMs)
			}
		}
	}
	testCase.ExpectedResponse = expected
	return nil
}

func generateTestCasePrefix(suite *conformancev1.TestSuite, cfgCase configCase) []string {
	components := make([]string, 1, 5)
	components = append(components, suite.Name)
	if len(suite.RelevantHttpVersions) != 1 {
		components = append(components, fmt.Sprintf("HTTPVersion:%d", cfgCase.Version))
	}
	if len(suite.RelevantProtocols) != 1 {
		components = append(components, fmt.Sprintf("Protocol:%s", cfgCase.Protocol))
	}
	if len(suite.RelevantCodecs) != 1 {
		components = append(components, fmt.Sprintf("Codec:%s", cfgCase.Codec))
	}
	if len(suite.RelevantCompressions) != 1 {
		components = append(components, fmt.Sprintf("Compression:%s", cfgCase.Compression))
	}
	if !suite.ReliesOnTls {
		components = append(components, fmt.Sprintf("TLS:%v", cfgCase.UseTLS))
	}
	return components
}

func allValues[T ~int32](m map[int32]string) []T {
	vals := make([]T, 0, len(m))
	for k := range m {
		if k == 0 {
			continue
		}
		vals = append(vals, T(k))
	}
	sort.Slice(vals, func(i, j int) bool {
		return vals[i] < vals[j]
	})
	return vals
}
