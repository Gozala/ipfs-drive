// @flow

import type { PeerId } from "peer-id"
import type { PeerInfo, Multiaddr } from "peer-info"

interface PeerBook {
  has(Peer): boolean;
  put(PeerInfo, boolean): PeerInfo;
  get(Peer): PeerInfo;
  getAll(): { [B58String]: PeerInfo };
  getAllArray(): PeerInfo[];
  getMultiaddrs(Peer): Multiaddr[];
  remove(Peer): void;
}

type B58String = string
type Peer = PeerId | PeerInfo | B58String
type PeerBookFactory = {
  (): PeerBook
}
type PeerBookLib = Class<PeerBook> & PeerBookFactory

declare module "peer-book/src/index" {
  declare export default PeerBookLib
}

declare module "peer-book" {
  declare export default PeerBookLib
  declare export type Peer = Peer
  declare export type B58String = B58String
  declare export type PeerId = PeerId
  declare export type PeerInfo = PeerInfo
  declare export type PeerBook = PeerBook
}
