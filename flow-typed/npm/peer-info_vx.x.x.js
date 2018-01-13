// @flow

import type { Callback } from "callback.flow"
import type { PeerId, JSONPeerId } from "peer-id"
import type { Multiaddr } from "multiaddr"

type Address = Multiaddr | Buffer | string
interface MultiaddrSet {
  add(Address): void;
  addSafe(Address): void;
  toArray(): Multiaddr[];
  forEach(fn: (Multiaddr, index?: number) => mixed): void;
  has(Address): boolean;
  delete(Address): void;
  replace(existing: Address, fresh: Address): void;
  clear(): void;
  distinct(): Multiaddr[];
}

export interface PeerInfo {
  id: PeerId;
  multiaddrs: MultiaddrSet;
  connect(Address): void;
  disconnect(): void;
  isConnected(): boolean;
}

export type PeerInfoFactory = Class<PeerInfo> & {
  constructor(PeerId): void,
  create(Callback<Error, PeerInfo>): void,
  create(PeerId | JSONPeerId, Callback<Error, PeerInfo>): void,
  isPeerInfo(mixed): boolean
}

declare module "peer-info" {
  declare export default PeerInfoFactory
  declare export type PeerInfoFactory = PeerInfoFactory
  declare export type PeerInfo = PeerInfo
  declare export type PeerId = PeerId
  declare export type JSONPeerId = JSONPeerId
  declare export type MultiaddrSet = MultiaddrSet
  declare export type Address = Address
  declare export type Multiaddr = Multiaddr
}

declare module "peer-info/src/index" {
  declare export default Lib
}

declare module "peer-info/src/multiaddr-set" {
  declare export type MultiaddrSet = MultiaddrSet
  declare export type Address = Address
  declare export type Multiaddr = Multiaddr

  declare export default Class<MultiaddrSet> & {
    constructor(multiaddrs?: Multiaddr[]): void
  }
}

type EnsureMultiaddr = (address: string | Buffer | Multiaddr) => Multiaddr

declare module "peer-info/src/util" {
  declare export var ensureMultiaddr: EnsureMultiaddr
}
