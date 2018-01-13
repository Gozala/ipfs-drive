// @flow

import type { Callback } from "callback.flow"
import type { Swarm } from "libp2p-swarm"
import type { PeerId, PublicKey } from "peer-id"
import type { PeerInfo } from "peer-info"
import type { Datastore } from "interface-datastore"
import type { CID } from "cids"

interface DHT {
  swarm: Swarm;
  kBucketSize: number;
  ncp: number;
  isStarted: boolean;
  routingTable: RoutingTable;
  datastore: Datastore<Buffer>;
  providers: Providers;
  peerInfo: PeerInfo;

  start(Callback<Error>): void;
  stop(Callback<Error>): void;
  getClosestPeers(key: Buffer, Callback<Error, PeerId[]>): void;
  put(key: Buffer, value: Buffer, Callback<Error>): void;
  get(key: Buffer, timeout: number, Callback<Error, Buffer>): void;
  getMany(
    key: Buffer,
    max: number,
    timeout: number,
    Callback<Error, BufferFrom>
  ): void;
  getPublicKey(PeerId, Callback<Error, PublicKey>): void;
  provide(CID, Callback<Error>): void;
  findProviders(CID, timeout: number, Callback<Error, PeerInfo[]>): void;
  findPeer(PeerId, timeout: number, Callback<Error, PeerInfo>): void;
  findPeerLocal(PeerId, Callback<Error, PeerInfo>): void;
  bootstrapStart(queries: number, period: number, timeout: number): void;
  bootstrapStop(): void;
}

type BufferFrom = { from: PeerId, value: Buffer }

interface RoutingTable {
  size: number;
  find(PeerId, OnFind): void;
  closestPeer(Buffer, number): ?PeerId;
  closestPeers(Buffer, number): PeerId[];
  add(PeerId, OnAdd): void;
  remove(PeerId, OnRemove): void;
}

interface Providers {
  cleanupInterval: number;
  provideValidity: number;
  lruCacheSize: number;
  addProvider(CID, PeerId, Callback<Error>): void;
  getProviders(CID, Callback<Error, PeerId[]>): void;
}

interface Messenger {
  addProvider: ProcessMessage;
  findNode: ProcessMessage;
  getProviders: ProcessMessage;
  getValue: ProcessMessage;
  ping: ProcessMessage;
  putValue: ProcessMessage;
}

type OnFind = Callback<FindError, PeerId>
interface FindError extends Error {}

type OnAdd = Callback<AddError>
interface AddError extends Error {}

type OnRemove = Callback<RemoveError>
interface RemoveError extends Error {}

interface ProcessMessage {
  (PeerInfo, ControlMessage, MessageCallback): void;
}

type MessageCallback = Callback<ProcessMessageError, ControlMessage>

interface ProcessMessageError extends Error {}

interface Deserialize<a> {
  deserialize(Buffer): a;
}

interface ControlMessage {
  clusterLevel: number;
  serialize(): Buffer;
}

interface DHTConstructor {
  (Swarm): void;
  (Swarm, DHTOptions): void;
}

interface DHTOptions {
  kBucketSize?: number;
  datastore?: Datastore<Buffer>;
}

type DHTFactory = Factory<DHT, DHTConstructor>

declare module "libp2p-kad-dht" {
  declare export default DHTFactory
  declare export type DHT = DHT
  declare export type DHTFactory = DHTFactory
  declare export type RoutingTable = RoutingTable
  declare export type BufferFrom = BufferFrom
  declare export type Providers = Providers
  declare export type ControlMessage = ControlMessage
  declare export type DeserializeMessage = Deserialize<ControlMessage>
  declare export type DHTOptions = DHTOptions

  declare export type OnFind = OnFind
  declare export type FindError = FindError

  declare export type OnAdd = OnAdd
  declare export type AddError = AddError
  declare export type OnRemove = OnRemove
  declare export type RemoveError = RemoveError

  declare export type Swarm = Swarm
  declare export type PeerId = PeerId
  declare export type PublicKey = PublicKey
  declare export type PeerInfo = PeerInfo
  declare export type Datastore = Datastore
  declare export type CID = CID
}
