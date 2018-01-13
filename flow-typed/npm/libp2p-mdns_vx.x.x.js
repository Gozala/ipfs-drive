// @flow

import type { Factory } from "factory.flow"
import type { PeerInfo } from "peer-info"

interface MulticastDNS {
  start(Callback<void>): void;
  stop(Callback<Error>): void;

  on("peer", OnPeer): MulticastDNS;
  once("peer", OnPeer): MulticastDNS;

  removeListener("peer", OnPeer): MulticastDNS;
  setMaxListeners(n: number): MulticastDNS;
  getMaxListeners(): number;
  listenerCount(string): number;
  eventNames(): string[];
}

type OnPeer = PeerInfo => void

interface MulticastDNSConstructor {
  (PeerInfo, MulticastDNSOptions): void;
}

interface MulticastDNSOptions {
  broadcast?: boolean;
  interval?: number;
  serviceTag?: string;
}

type MulticastDNSFactory = Factory<MulticastDNS, MulticastDNSConstructor>

declare module "libp2p-mdns" {
  declare export default MulticastDNSFactory
  declare export type Discovery = Discovery
  declare export type MulticastDNS = MulticastDNS
  declare export type MulticastDNSOptions = MulticastDNSOptions
  declare export type PeerInfo = PeerInfo
}
