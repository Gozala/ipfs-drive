// @flow

import type { Callback } from "callback.flow"
import type { PeerInfo } from "peer-info"
import type { PeerId } from "peer-id"
import type { Block } from "ipfs-block"
import type { Blockstore } from "ipfs-repo"
import type { Libp2p } from "libp2p"

// https://github.com/ipfs/js-ipfs-bitswap/blob/master/src/index.js
export interface Bitswap {
  peerInfo: PeerInfo;
  enableStats(): void;
  disableStats(): void;

  wantlistForPeer(PeerId): Wantlist;
  get(CID, Callback<Error, Block>): void;
  getMany(CID[], Callback<Error, Block[]>): void;
  unwant(CID[]): void;
  cancelWants(CID[]): void;
  put(Block, Callback<Error>): void;
  putMany(Block[], Callback<Error>): void;
  getWantlist(): Iterator<WantlistEntry>;
  peers(): PeerId[];
  stat(): Stat;
  start(Callback<Error>): void;
  stop(Callback<Error>): void;
}

export type Priority = number

//https://github.com/ipfs/js-ipfs-bitswap/blob/master/src/types/message/entry.js
export interface BitswapMessageEntry {
  cid: CID;
  priority: Priority;
  cancel: boolean;
  equals(BitswapMessageEntry): boolean;
}

// https://github.com/ipfs/js-ipfs-bitswap/blob/master/src/types/message/index.js
export interface BitswapMessage {
  full: boolean;
  empty: boolean;
  addEntry(CID, Priority, boolean): void;
  addBlock(Block): void;
  cancel(CID): void;
  equals(BitswapMessage): boolean;
  serializeToBitswap110(): Buffer;
  serializeToBitswap100(): Buffer;
}

// https://github.com/ipfs/js-ipfs-bitswap/blob/master/src/types/wantlist/index.js
interface Wantlist {
  length: number;
  add(CID, number): void;
  remove(CID): void;
  removeForce(CID): void;
  contains(CID): boolean;
  entries(): Iterator<[CID, WantlistEntry]>;
  sortedEntries(): Map<CID, WantlistEntry>;
  forEach(f: (WantlistEntry, number) => mixed): void;
}

//https://github.com/ipfs/js-ipfs-bitswap/blob/master/src/types/wantlist/entry.js
interface WantlistEntry {
  cid: CID;
  priority: Priority;
  inc(): void;
  dec(): void;
  hasRefs(): boolean;
  equals(WantlistEntry): boolean;
}

export type Stat = {}

interface BitswapFactory {
  (Libp2p, Blockstore, ?BitswapOptions): void;
}

interface BitswapOptions {
  statsEnabled?: boolean;
  statsComputeThrottleTimeout?: number;
  statsComputeThrottleMaxQueueSize?: number;
}

type Lib = Class<Bitswap>

declare module "ipfs-bitswap" {
  declare export default Lib
  declare export type Bitswap = Bitswap
  declare export type BitswapOptions = BitswapOptions
  declare export type WantlistEntry = WantlistEntry
  declare export type Wantlist = Wantlist
  declare export type BitswapMessage = BitswapMessage
  declare export type BitswapMessageEntry = BitswapMessageEntry
  declare export type Priority = Priority
}
