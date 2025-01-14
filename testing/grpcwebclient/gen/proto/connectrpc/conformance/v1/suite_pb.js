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

// source: connectrpc/conformance/v1/suite.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global) ||
    (typeof self !== 'undefined' && self) ||
    (function () { return this; }).call(null) ||
    Function('return this')();

var connectrpc_conformance_v1_client_compat_pb = require('../../../connectrpc/conformance/v1/client_compat_pb.js');
goog.object.extend(proto, connectrpc_conformance_v1_client_compat_pb);
var connectrpc_conformance_v1_config_pb = require('../../../connectrpc/conformance/v1/config_pb.js');
goog.object.extend(proto, connectrpc_conformance_v1_config_pb);
goog.exportSymbol('proto.connectrpc.conformance.v1.TestCase', null, global);
goog.exportSymbol('proto.connectrpc.conformance.v1.TestCase.ExpandedSize', null, global);
goog.exportSymbol('proto.connectrpc.conformance.v1.TestSuite', null, global);
goog.exportSymbol('proto.connectrpc.conformance.v1.TestSuite.ConnectVersionMode', null, global);
goog.exportSymbol('proto.connectrpc.conformance.v1.TestSuite.TestMode', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.connectrpc.conformance.v1.TestSuite = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.connectrpc.conformance.v1.TestSuite.repeatedFields_, null);
};
goog.inherits(proto.connectrpc.conformance.v1.TestSuite, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.connectrpc.conformance.v1.TestSuite.displayName = 'proto.connectrpc.conformance.v1.TestSuite';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.connectrpc.conformance.v1.TestCase = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.connectrpc.conformance.v1.TestCase.repeatedFields_, null);
};
goog.inherits(proto.connectrpc.conformance.v1.TestCase, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.connectrpc.conformance.v1.TestCase.displayName = 'proto.connectrpc.conformance.v1.TestCase';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.connectrpc.conformance.v1.TestCase.ExpandedSize, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.connectrpc.conformance.v1.TestCase.ExpandedSize.displayName = 'proto.connectrpc.conformance.v1.TestCase.ExpandedSize';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.connectrpc.conformance.v1.TestSuite.repeatedFields_ = [3,4,5,6,7];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.toObject = function(opt_includeInstance) {
  return proto.connectrpc.conformance.v1.TestSuite.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.connectrpc.conformance.v1.TestSuite} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.connectrpc.conformance.v1.TestSuite.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    mode: jspb.Message.getFieldWithDefault(msg, 2, 0),
    testCasesList: jspb.Message.toObjectList(msg.getTestCasesList(),
    proto.connectrpc.conformance.v1.TestCase.toObject, includeInstance),
    relevantProtocolsList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
    relevantHttpVersionsList: (f = jspb.Message.getRepeatedField(msg, 5)) == null ? undefined : f,
    relevantCodecsList: (f = jspb.Message.getRepeatedField(msg, 6)) == null ? undefined : f,
    relevantCompressionsList: (f = jspb.Message.getRepeatedField(msg, 7)) == null ? undefined : f,
    connectVersionMode: jspb.Message.getFieldWithDefault(msg, 8, 0),
    reliesOnTls: jspb.Message.getBooleanFieldWithDefault(msg, 9, false),
    reliesOnTlsClientCerts: jspb.Message.getBooleanFieldWithDefault(msg, 10, false),
    reliesOnConnectGet: jspb.Message.getBooleanFieldWithDefault(msg, 11, false),
    reliesOnMessageReceiveLimit: jspb.Message.getBooleanFieldWithDefault(msg, 12, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.connectrpc.conformance.v1.TestSuite}
 */
proto.connectrpc.conformance.v1.TestSuite.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.connectrpc.conformance.v1.TestSuite;
  return proto.connectrpc.conformance.v1.TestSuite.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.connectrpc.conformance.v1.TestSuite} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.connectrpc.conformance.v1.TestSuite}
 */
proto.connectrpc.conformance.v1.TestSuite.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {!proto.connectrpc.conformance.v1.TestSuite.TestMode} */ (reader.readEnum());
      msg.setMode(value);
      break;
    case 3:
      var value = new proto.connectrpc.conformance.v1.TestCase;
      reader.readMessage(value,proto.connectrpc.conformance.v1.TestCase.deserializeBinaryFromReader);
      msg.addTestCases(value);
      break;
    case 4:
      var values = /** @type {!Array<!proto.connectrpc.conformance.v1.Protocol>} */ (reader.isDelimited() ? reader.readPackedEnum() : [reader.readEnum()]);
      for (var i = 0; i < values.length; i++) {
        msg.addRelevantProtocols(values[i]);
      }
      break;
    case 5:
      var values = /** @type {!Array<!proto.connectrpc.conformance.v1.HTTPVersion>} */ (reader.isDelimited() ? reader.readPackedEnum() : [reader.readEnum()]);
      for (var i = 0; i < values.length; i++) {
        msg.addRelevantHttpVersions(values[i]);
      }
      break;
    case 6:
      var values = /** @type {!Array<!proto.connectrpc.conformance.v1.Codec>} */ (reader.isDelimited() ? reader.readPackedEnum() : [reader.readEnum()]);
      for (var i = 0; i < values.length; i++) {
        msg.addRelevantCodecs(values[i]);
      }
      break;
    case 7:
      var values = /** @type {!Array<!proto.connectrpc.conformance.v1.Compression>} */ (reader.isDelimited() ? reader.readPackedEnum() : [reader.readEnum()]);
      for (var i = 0; i < values.length; i++) {
        msg.addRelevantCompressions(values[i]);
      }
      break;
    case 8:
      var value = /** @type {!proto.connectrpc.conformance.v1.TestSuite.ConnectVersionMode} */ (reader.readEnum());
      msg.setConnectVersionMode(value);
      break;
    case 9:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setReliesOnTls(value);
      break;
    case 10:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setReliesOnTlsClientCerts(value);
      break;
    case 11:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setReliesOnConnectGet(value);
      break;
    case 12:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setReliesOnMessageReceiveLimit(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.connectrpc.conformance.v1.TestSuite.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.connectrpc.conformance.v1.TestSuite} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.connectrpc.conformance.v1.TestSuite.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getMode();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getTestCasesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.connectrpc.conformance.v1.TestCase.serializeBinaryToWriter
    );
  }
  f = message.getRelevantProtocolsList();
  if (f.length > 0) {
    writer.writePackedEnum(
      4,
      f
    );
  }
  f = message.getRelevantHttpVersionsList();
  if (f.length > 0) {
    writer.writePackedEnum(
      5,
      f
    );
  }
  f = message.getRelevantCodecsList();
  if (f.length > 0) {
    writer.writePackedEnum(
      6,
      f
    );
  }
  f = message.getRelevantCompressionsList();
  if (f.length > 0) {
    writer.writePackedEnum(
      7,
      f
    );
  }
  f = message.getConnectVersionMode();
  if (f !== 0.0) {
    writer.writeEnum(
      8,
      f
    );
  }
  f = message.getReliesOnTls();
  if (f) {
    writer.writeBool(
      9,
      f
    );
  }
  f = message.getReliesOnTlsClientCerts();
  if (f) {
    writer.writeBool(
      10,
      f
    );
  }
  f = message.getReliesOnConnectGet();
  if (f) {
    writer.writeBool(
      11,
      f
    );
  }
  f = message.getReliesOnMessageReceiveLimit();
  if (f) {
    writer.writeBool(
      12,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.connectrpc.conformance.v1.TestSuite.TestMode = {
  TEST_MODE_UNSPECIFIED: 0,
  TEST_MODE_CLIENT: 1,
  TEST_MODE_SERVER: 2
};

/**
 * @enum {number}
 */
proto.connectrpc.conformance.v1.TestSuite.ConnectVersionMode = {
  CONNECT_VERSION_MODE_UNSPECIFIED: 0,
  CONNECT_VERSION_MODE_REQUIRE: 1,
  CONNECT_VERSION_MODE_IGNORE: 2
};

/**
 * optional string name = 1;
 * @return {string}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional TestMode mode = 2;
 * @return {!proto.connectrpc.conformance.v1.TestSuite.TestMode}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getMode = function() {
  return /** @type {!proto.connectrpc.conformance.v1.TestSuite.TestMode} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.connectrpc.conformance.v1.TestSuite.TestMode} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setMode = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * repeated TestCase test_cases = 3;
 * @return {!Array<!proto.connectrpc.conformance.v1.TestCase>}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getTestCasesList = function() {
  return /** @type{!Array<!proto.connectrpc.conformance.v1.TestCase>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.connectrpc.conformance.v1.TestCase, 3));
};


/**
 * @param {!Array<!proto.connectrpc.conformance.v1.TestCase>} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
*/
proto.connectrpc.conformance.v1.TestSuite.prototype.setTestCasesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.connectrpc.conformance.v1.TestCase=} opt_value
 * @param {number=} opt_index
 * @return {!proto.connectrpc.conformance.v1.TestCase}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.addTestCases = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.connectrpc.conformance.v1.TestCase, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.clearTestCasesList = function() {
  return this.setTestCasesList([]);
};


/**
 * repeated Protocol relevant_protocols = 4;
 * @return {!Array<!proto.connectrpc.conformance.v1.Protocol>}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getRelevantProtocolsList = function() {
  return /** @type {!Array<!proto.connectrpc.conformance.v1.Protocol>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<!proto.connectrpc.conformance.v1.Protocol>} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setRelevantProtocolsList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {!proto.connectrpc.conformance.v1.Protocol} value
 * @param {number=} opt_index
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.addRelevantProtocols = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.clearRelevantProtocolsList = function() {
  return this.setRelevantProtocolsList([]);
};


/**
 * repeated HTTPVersion relevant_http_versions = 5;
 * @return {!Array<!proto.connectrpc.conformance.v1.HTTPVersion>}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getRelevantHttpVersionsList = function() {
  return /** @type {!Array<!proto.connectrpc.conformance.v1.HTTPVersion>} */ (jspb.Message.getRepeatedField(this, 5));
};


/**
 * @param {!Array<!proto.connectrpc.conformance.v1.HTTPVersion>} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setRelevantHttpVersionsList = function(value) {
  return jspb.Message.setField(this, 5, value || []);
};


/**
 * @param {!proto.connectrpc.conformance.v1.HTTPVersion} value
 * @param {number=} opt_index
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.addRelevantHttpVersions = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 5, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.clearRelevantHttpVersionsList = function() {
  return this.setRelevantHttpVersionsList([]);
};


/**
 * repeated Codec relevant_codecs = 6;
 * @return {!Array<!proto.connectrpc.conformance.v1.Codec>}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getRelevantCodecsList = function() {
  return /** @type {!Array<!proto.connectrpc.conformance.v1.Codec>} */ (jspb.Message.getRepeatedField(this, 6));
};


/**
 * @param {!Array<!proto.connectrpc.conformance.v1.Codec>} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setRelevantCodecsList = function(value) {
  return jspb.Message.setField(this, 6, value || []);
};


/**
 * @param {!proto.connectrpc.conformance.v1.Codec} value
 * @param {number=} opt_index
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.addRelevantCodecs = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 6, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.clearRelevantCodecsList = function() {
  return this.setRelevantCodecsList([]);
};


/**
 * repeated Compression relevant_compressions = 7;
 * @return {!Array<!proto.connectrpc.conformance.v1.Compression>}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getRelevantCompressionsList = function() {
  return /** @type {!Array<!proto.connectrpc.conformance.v1.Compression>} */ (jspb.Message.getRepeatedField(this, 7));
};


/**
 * @param {!Array<!proto.connectrpc.conformance.v1.Compression>} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setRelevantCompressionsList = function(value) {
  return jspb.Message.setField(this, 7, value || []);
};


/**
 * @param {!proto.connectrpc.conformance.v1.Compression} value
 * @param {number=} opt_index
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.addRelevantCompressions = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 7, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.clearRelevantCompressionsList = function() {
  return this.setRelevantCompressionsList([]);
};


/**
 * optional ConnectVersionMode connect_version_mode = 8;
 * @return {!proto.connectrpc.conformance.v1.TestSuite.ConnectVersionMode}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getConnectVersionMode = function() {
  return /** @type {!proto.connectrpc.conformance.v1.TestSuite.ConnectVersionMode} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {!proto.connectrpc.conformance.v1.TestSuite.ConnectVersionMode} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setConnectVersionMode = function(value) {
  return jspb.Message.setProto3EnumField(this, 8, value);
};


/**
 * optional bool relies_on_tls = 9;
 * @return {boolean}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getReliesOnTls = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 9, false));
};


/**
 * @param {boolean} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setReliesOnTls = function(value) {
  return jspb.Message.setProto3BooleanField(this, 9, value);
};


/**
 * optional bool relies_on_tls_client_certs = 10;
 * @return {boolean}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getReliesOnTlsClientCerts = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 10, false));
};


/**
 * @param {boolean} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setReliesOnTlsClientCerts = function(value) {
  return jspb.Message.setProto3BooleanField(this, 10, value);
};


/**
 * optional bool relies_on_connect_get = 11;
 * @return {boolean}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getReliesOnConnectGet = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 11, false));
};


/**
 * @param {boolean} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setReliesOnConnectGet = function(value) {
  return jspb.Message.setProto3BooleanField(this, 11, value);
};


/**
 * optional bool relies_on_message_receive_limit = 12;
 * @return {boolean}
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.getReliesOnMessageReceiveLimit = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 12, false));
};


/**
 * @param {boolean} value
 * @return {!proto.connectrpc.conformance.v1.TestSuite} returns this
 */
proto.connectrpc.conformance.v1.TestSuite.prototype.setReliesOnMessageReceiveLimit = function(value) {
  return jspb.Message.setProto3BooleanField(this, 12, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.connectrpc.conformance.v1.TestCase.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.connectrpc.conformance.v1.TestCase.prototype.toObject = function(opt_includeInstance) {
  return proto.connectrpc.conformance.v1.TestCase.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.connectrpc.conformance.v1.TestCase} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.connectrpc.conformance.v1.TestCase.toObject = function(includeInstance, msg) {
  var f, obj = {
    request: (f = msg.getRequest()) && connectrpc_conformance_v1_client_compat_pb.ClientCompatRequest.toObject(includeInstance, f),
    expandRequestsList: jspb.Message.toObjectList(msg.getExpandRequestsList(),
    proto.connectrpc.conformance.v1.TestCase.ExpandedSize.toObject, includeInstance),
    expectedResponse: (f = msg.getExpectedResponse()) && connectrpc_conformance_v1_client_compat_pb.ClientResponseResult.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.connectrpc.conformance.v1.TestCase}
 */
proto.connectrpc.conformance.v1.TestCase.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.connectrpc.conformance.v1.TestCase;
  return proto.connectrpc.conformance.v1.TestCase.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.connectrpc.conformance.v1.TestCase} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.connectrpc.conformance.v1.TestCase}
 */
proto.connectrpc.conformance.v1.TestCase.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new connectrpc_conformance_v1_client_compat_pb.ClientCompatRequest;
      reader.readMessage(value,connectrpc_conformance_v1_client_compat_pb.ClientCompatRequest.deserializeBinaryFromReader);
      msg.setRequest(value);
      break;
    case 2:
      var value = new proto.connectrpc.conformance.v1.TestCase.ExpandedSize;
      reader.readMessage(value,proto.connectrpc.conformance.v1.TestCase.ExpandedSize.deserializeBinaryFromReader);
      msg.addExpandRequests(value);
      break;
    case 3:
      var value = new connectrpc_conformance_v1_client_compat_pb.ClientResponseResult;
      reader.readMessage(value,connectrpc_conformance_v1_client_compat_pb.ClientResponseResult.deserializeBinaryFromReader);
      msg.setExpectedResponse(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.connectrpc.conformance.v1.TestCase.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.connectrpc.conformance.v1.TestCase.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.connectrpc.conformance.v1.TestCase} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.connectrpc.conformance.v1.TestCase.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRequest();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      connectrpc_conformance_v1_client_compat_pb.ClientCompatRequest.serializeBinaryToWriter
    );
  }
  f = message.getExpandRequestsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.connectrpc.conformance.v1.TestCase.ExpandedSize.serializeBinaryToWriter
    );
  }
  f = message.getExpectedResponse();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      connectrpc_conformance_v1_client_compat_pb.ClientResponseResult.serializeBinaryToWriter
    );
  }
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.prototype.toObject = function(opt_includeInstance) {
  return proto.connectrpc.conformance.v1.TestCase.ExpandedSize.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.connectrpc.conformance.v1.TestCase.ExpandedSize} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.toObject = function(includeInstance, msg) {
  var f, obj = {
    sizeRelativeToLimit: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.connectrpc.conformance.v1.TestCase.ExpandedSize}
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.connectrpc.conformance.v1.TestCase.ExpandedSize;
  return proto.connectrpc.conformance.v1.TestCase.ExpandedSize.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.connectrpc.conformance.v1.TestCase.ExpandedSize} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.connectrpc.conformance.v1.TestCase.ExpandedSize}
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setSizeRelativeToLimit(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.connectrpc.conformance.v1.TestCase.ExpandedSize.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.connectrpc.conformance.v1.TestCase.ExpandedSize} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {number} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeInt32(
      1,
      f
    );
  }
};


/**
 * optional int32 size_relative_to_limit = 1;
 * @return {number}
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.prototype.getSizeRelativeToLimit = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.connectrpc.conformance.v1.TestCase.ExpandedSize} returns this
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.prototype.setSizeRelativeToLimit = function(value) {
  return jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.connectrpc.conformance.v1.TestCase.ExpandedSize} returns this
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.prototype.clearSizeRelativeToLimit = function() {
  return jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.connectrpc.conformance.v1.TestCase.ExpandedSize.prototype.hasSizeRelativeToLimit = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ClientCompatRequest request = 1;
 * @return {?proto.connectrpc.conformance.v1.ClientCompatRequest}
 */
proto.connectrpc.conformance.v1.TestCase.prototype.getRequest = function() {
  return /** @type{?proto.connectrpc.conformance.v1.ClientCompatRequest} */ (
    jspb.Message.getWrapperField(this, connectrpc_conformance_v1_client_compat_pb.ClientCompatRequest, 1));
};


/**
 * @param {?proto.connectrpc.conformance.v1.ClientCompatRequest|undefined} value
 * @return {!proto.connectrpc.conformance.v1.TestCase} returns this
*/
proto.connectrpc.conformance.v1.TestCase.prototype.setRequest = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.connectrpc.conformance.v1.TestCase} returns this
 */
proto.connectrpc.conformance.v1.TestCase.prototype.clearRequest = function() {
  return this.setRequest(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.connectrpc.conformance.v1.TestCase.prototype.hasRequest = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated ExpandedSize expand_requests = 2;
 * @return {!Array<!proto.connectrpc.conformance.v1.TestCase.ExpandedSize>}
 */
proto.connectrpc.conformance.v1.TestCase.prototype.getExpandRequestsList = function() {
  return /** @type{!Array<!proto.connectrpc.conformance.v1.TestCase.ExpandedSize>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.connectrpc.conformance.v1.TestCase.ExpandedSize, 2));
};


/**
 * @param {!Array<!proto.connectrpc.conformance.v1.TestCase.ExpandedSize>} value
 * @return {!proto.connectrpc.conformance.v1.TestCase} returns this
*/
proto.connectrpc.conformance.v1.TestCase.prototype.setExpandRequestsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.connectrpc.conformance.v1.TestCase.ExpandedSize=} opt_value
 * @param {number=} opt_index
 * @return {!proto.connectrpc.conformance.v1.TestCase.ExpandedSize}
 */
proto.connectrpc.conformance.v1.TestCase.prototype.addExpandRequests = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.connectrpc.conformance.v1.TestCase.ExpandedSize, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.connectrpc.conformance.v1.TestCase} returns this
 */
proto.connectrpc.conformance.v1.TestCase.prototype.clearExpandRequestsList = function() {
  return this.setExpandRequestsList([]);
};


/**
 * optional ClientResponseResult expected_response = 3;
 * @return {?proto.connectrpc.conformance.v1.ClientResponseResult}
 */
proto.connectrpc.conformance.v1.TestCase.prototype.getExpectedResponse = function() {
  return /** @type{?proto.connectrpc.conformance.v1.ClientResponseResult} */ (
    jspb.Message.getWrapperField(this, connectrpc_conformance_v1_client_compat_pb.ClientResponseResult, 3));
};


/**
 * @param {?proto.connectrpc.conformance.v1.ClientResponseResult|undefined} value
 * @return {!proto.connectrpc.conformance.v1.TestCase} returns this
*/
proto.connectrpc.conformance.v1.TestCase.prototype.setExpectedResponse = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.connectrpc.conformance.v1.TestCase} returns this
 */
proto.connectrpc.conformance.v1.TestCase.prototype.clearExpectedResponse = function() {
  return this.setExpectedResponse(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.connectrpc.conformance.v1.TestCase.prototype.hasExpectedResponse = function() {
  return jspb.Message.getField(this, 3) != null;
};


goog.object.extend(exports, proto.connectrpc.conformance.v1);
