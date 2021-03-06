function encodeObject(obj) {
  const enc = new TextEncoder();
  return enc.encode(JSON.stringify(obj));
}

function decodeObject(array) {
  //return JSON.parse(String.fromCharCode.apply(null, new Uint8Array(array)));
  return JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(array)));
}

export { Multiplexer } from './src/multiplexer.mjs';
export { Producer, Consumer } from './src/core.mjs';
export { WebSocketTransport, initiateWebSocketMux } from './src/transport.mjs';
export { encodeObject, decodeObject };
export { BufferConduit } from './src/conduit.mjs';
export { MapConduit } from './src/map_conduit.mjs';
