// @flow

import type { Source, Sink, Duplex } from "pull-stream"
import type { Callback } from "callback.flow"
import type { PeerInfo, Multiaddr } from "peer-info"

interface PeerInfoError extends Error {}

interface AddrsError extends Error {}

interface Connection {
  source: Source<Error, Buffer>;
  sink: Sink<Error, Buffer>;

  getPeerInfo(Callback<PeerInfoError, PeerInfo>): void;
  setPeerInfo(PeerInfo): void;
  // TODO: Line linked below suggests that `PeerInfo` has `getObservedAddrs`:
  // https://github.com/libp2p/interface-connection/blob/7cf11bef91e37b0071940da86bd0cc3fb22359c9/src/connection.js#L47
  // but looking at `PeerInfo` implementation there is no such method:
  // https://github.com/libp2p/js-peer-info/blob/c6944e3781dfc5accac662acf2fd742e0b941441/src/index.js
  // Maybe `peerInfo` in the `Connection` is something else ?
  getObservedAddrs(Callback<AddrsError, Multiaddr[]>): void;
}

interface ConnectionFactory {
  (conn: Duplex<Error, Buffer>, PeerInfo): void;
}

type ConnectionLib = Class<Connection> & ConnectionFactory

declare module "interface-connection/src/connection" {
  declare export default ConnectionLib
}

declare module "interface-connection/src/index" {
  declare export var Connection: ConnectionLib
}

declare module "interface-connection" {
  declare export var Connection: ConnectionLib
  declare export type PeerInfoError = PeerInfoError
  declare export type AddrsError = AddrsError
}
