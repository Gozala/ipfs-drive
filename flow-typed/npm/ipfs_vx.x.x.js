// @flow

import type { Callback } from "callback.flow"
import type { IPLDResolver } from "ipld-resolver"
import type { Block } from "ipfs-block"
import type { Repo } from "ipfs-repo"
import type { Libp2p, Libp2pModules } from "libp2p"
import type { PeerIdFactory, PeerId } from "peer-id"
import type { PeerInfoFactory, PeerInfo } from "peer-info"
import type { MultiaddrFactory, Multiaddr } from "multiaddr"
import type { CIDFactory, CID } from "cids"
import type { Duplex } from "pull-stream"
import * as DAG from "ipld-dag-pb"
import stream from "stream"
import multihash from "multihash"

type Readable = typeof stream.Readable
type DuplexStream = typeof stream.Duplex

export interface IPFS {
  _ipldResolver: IPLDResolver<Block>;

  files: IPFSFiles;
  blocks: IPFSBlocks;
  repo: IPFSRepo;
  dag: Dag<*>;
  object: IPFSObject;

  bootstrap: IPFSBootstrap;
  // TODO: It's actually a subset of this API
  bitswap: Bitswap;
  pubsub: IPFSPubSub;
  libp2p: Libp2p;
  // TODO: It's actually a different API
  swarm: Swarm;
  config: Config;
  types: IPFSFactories;

  // Events
  on("ready", () => void): IPFS;
  on("start", () => void): IPFS;
  on("stop", () => void): IPFS;
  on("error", (Error) => void): IPFS;
  once("ready", () => void): IPFS;
  once("start", () => void): IPFS;
  once("stop", () => void): IPFS;
  once("error", (Error) => void): IPFS;
}

interface IPFSFactories {
  Buffer: Class<Buffer>;
  PeerId: PeerIdFactory;
  PeerInfo: PeerInfoFactory;
  multiaddr: MultiaddrFactory;
  multihash: typeof multihash;
  CID: CIDFactory;
}

interface IPFSRepo {
  // TODO: Figure out what the API is actually here:
  // https://github.com/ipfs/js-ipfs/blob/fadead15b099a4bcc180ff780b373dc015eada08/src/core/components/repo.js#L5
  init(Buffer, boolean, Callback<Error>): void;
  version(Callback<Error, number>): void;
  gc(): void;
  path(): string;
}

interface IPFSFiles {
  add(Buffer, ?AddOptions): Promise<AddResult>;
  add(Readable, ?AddOptions): Promise<AddResult>;
  add(Source<Error, Buffer>, ?AddOptions): Promise<AddResult>;
  add(WriteEntry[], ?AddOptions): Promise<AddResult[]>;

  add(Buffer, OnAdd): void;
  add(Readable, OnAdd): void;
  add(Source<Error, Buffer>, OnAdd): void;
  add(WriteEntry[], OnAddMany): void;

  add(Buffer, AddOptions, OnAdd): void;
  add(Readable, AddOptions, OnAdd): void;
  add(Source<Error, Buffer>, AddOptions, OnAdd): void;
  add(WriteEntry[], AddOptions, OnAddMany): void;

  // TODO: Node streams are typed as binary streams and not object
  // streams so it's not going to really work;
  addReadableStream(?AddOptions): DuplexStream;
  addPullStream(?AddOptions): Duplex<Error, Error, WriteEntry, AddResult>;

  cat(IPFSPath): Promise<Buffer>;
  cat(IPFSPath, Callback<Error, Buffer>): void;
  catReadableStream(IPFSPath): Readable;
  catPullStream(IPFSPath): Source<Error, Buffer>;

  get(IPFSPath): Promise<BufferEntry>;
  get(IPFSPath, Callback<Error, BufferEntry>): void;
  getReadableStream(IPFSPath): Readable;
  getPullStream(IPFSPath): Source<Error, PullStreamEntry>;

  ls(IPFSPath): Promise<LS>;
  ls(IPFSPath, Callback<Error, LS>): void;
  lsReadableStream(IPFSPath): Readable;
  lsPullStream(IPFSPath): Source<Error, LSEntry>;
}

type IPFSPath = Buffer | string

interface WriteEntry {
  path: string;
  content: Buffer | Readable | Source<Error, Buffer>;
}

interface BufferEntry {
  path: string;
  content: Buffer;
}

interface PullStreamEntry {
  path: string;
  content: Source<Error, Buffer>;
}

interface ReadableStreamEntry {
  path: string;
  content: Readable;
}

interface LSEntry {
  depth: number;
  name: string;
  path: string;
  size: number;
  hash: string;
  type: "file" | "dir";
}

type LS = LSEntry[]

interface AddResult {
  path: string;
  hash: string;
  size: number;
}

type AddOptions = {
  "cid-version"?: number,
  progress?: number => void,
  recursive?: boolean,
  hash?: string
}

type OnAdd = Callback<Error, AddResult>
type OnAddMany = Callback<Error, AddResult[]>

interface IPFSBlocks {
  get(IPFSCID): Promise<Block>;
  get(IPFSCID, Callback<Error, Block>): void;

  put(IPFSCID, ?PutOptions): Promise<Block>;
  put(IPFSCID, PutOptions, Callback<Error, Block>): void;
  put(IPFSCID, Callback<Error, Block>): void;

  stat(IPFSCID): Promise<BlockStat>;
  stat(IPFSCID, Callback<Error, BlockStat>): void;
}

type IPFSCID = CID | Buffer | string

interface PutOptions {
  format?: string;
  mhtype?: string;
  version?: number;
}

interface BlockStat {
  cid: string;
  size: number;
}

interface Dag<node> {
  put(node, DagPutOptions): Promise<CID>;
  put(node, DagPutOptions, Callback<Error, CID>): void;

  get(IPFSCID, ?Path, ?DagGetOptions): Promise<DagGet<node>>;
  get(IPFSCID, Path, DagGetOptions, Callback<Error, DagGet<node>>): void;
  get(IPFSCID, Path, Callback<Error, DagGet<node>>): void;
  get(IPFSCID, DagGetOptions, Callback<Error, DagGet<node>>): void;
  get(IPFSCID, Callback<Error, DagGet<node>>): void;

  tree(IPFSCID, ?Path, ?DagTreeOptions): Promise<Path[]>;
  tree(IPFSCID, Path, DagTreeOptions, Callback<Error, Path[]>): void;
  tree(IPFSCID, DagTreeOptions, Callback<Error, Path[]>): void;
  tree(IPFSCID, Path, Callback<Error, Path[]>): void;
  tree(IPFSCID, Callback<Error, Path[]>): void;
}

type DagPutOptions = { format: string, hashAlg: string } | { cid: CID }
type Path = string
type DagGetOptions = { localResolve?: boolean }
type DagGet<node> = { value: node, remainderPath: string }
type DagTreeOptions = { recursive?: boolean }

interface IPFSObject {
  new(?Template): Promise<DAG.Node>;
  new(Template, Callback<DAG.Node>): void;
  new(Callback<DAG.Node>): void;

  put(ObjectPut, ?ObjectOptions): Promise<DAG.Node>;
  put(ObjectPut, ObjectOptions, Callback<Error, DAG.Node>): void;
  put(ObjectPut, Callback<Error, DAG.Node>): void;
  put(Buffer, ObjectOptions, Callback<Error, DAG.Node>): void;

  get(ObjectCID, ?ObjectOptions): Promise<DAG.Node>;
  get(ObjectCID, ObjectOptions, Callback<Error, DAG.Node>): void;
  get(ObjectCID, Callback<Error, DAG.Node>): void;

  data(ObjectCID, ?ObjectOptions): Promise<Buffer>;
  data(ObjectCID, ObjectOptions, Callback<Error, Buffer>): void;
  data(ObjectCID, Callback<Error, Buffer>): void;

  links(ObjectCID, ?ObjectOptions): Promise<DAG.Link[]>;
  links(ObjectCID, ObjectOptions, Callback<Error, DAG.Link[]>): void;
  links(ObjectCID, Callback<Error, DAG.Link[]>): void;

  stat(ObjectCID, ?ObjectOptions): Promise<ObjectStat>;
  stat(ObjectCID, ObjectOptions, Callback<Error, ObjectStat>): void;
  stat(ObjectCID, Callback<Error, ObjectStat>): void;

  patch: ObjectPatch;
}

interface ObjectPatch {
  addLink(ObjectCID, ObjectLink, ?ObjectOptions): Promise<DAG.Node>;
  addLink(
    ObjectCID,
    ObjectLink,
    ObjectOptions,
    Callback<Error, DAG.Node>
  ): void;
  addLink(ObjectCID, ObjectLink, Callback<Error, DAG.Node>): void;

  rmLink(ObjectCID, ObjectLink, ?ObjectOptions): Promise<DAG.Node>;
  rmLink(ObjectCID, ObjectLink, ObjectOptions, Callback<Error, DAG.Node>): void;
  rmLink(ObjectCID, ObjectLink, Callback<Error, DAG.Node>): void;

  appendData(ObjectCID, Buffer, ?ObjectOptions): Promise<DAG.Node>;
  appendData(ObjectCID, Buffer, ObjectOptions, Callback<Error, DAG.Node>): void;
  appendData(ObjectCID, Buffer, Callback<Error, DAG.Node>): void;

  setData(ObjectCID, Buffer, ?ObjectOptions): Promise<DAG.Node>;
  setData(ObjectCID, Buffer, ObjectOptions, Callback<Error, DAG.Node>): void;
  setData(ObjectCID, Buffer, Callback<Error, DAG.Node>): void;
}

interface ObjectNode {
  data: Buffer;
  links: DAG.Link[];
}

type ObjectLink = DAG.JSONLink | DAG.Link

interface ObjectStat {
  Hash: string;
  NumLinks: number;
  BlockSize: number;
  LinksSize: number;
  DataSize: number;
  CumulativeSize: number;
}

type ObjectPut = DAG.Node | ObjectNode
type ObjectOptions = { enc: "string" }

type Template = string
type ObjectCID = Buffer | string

// TODO: Can't find any info
interface IPFSBootstrap {}

interface IPFSPubSub {
  subscribe(Topic, ?SubscribeOptions, Subscriber): Promise<void>;
  subscribe(Topic, ?SubscribeOptions, Subscriber, Callback<Error>): void;
  subscribe(Topic, Subscriber, Callback<Error>): void;

  unsubscribe(Topic, Subscriber): void;

  publish(Topic, Buffer): Promise<void>;
  publish(Topic, Buffer, Callback<Error>): void;

  ls(Topic): Promise<Topic[]>;
  ls(Topic, Callback<Error, Topic[]>): void;

  peers(Topic): Promise<string[]>;
  peers(Topic, Callback<Error, string[]>): void;
}

type Topic = string
type SubscribeOptions = { discover?: boolean }
interface Subscriber {
  (MSG): void;
}

interface MSG {
  from: string;
  seqno: Buffer;
  data: Buffer;
  topicIDs: Array<string>;
}

interface IPFSOptions {
  repo?: Repo | string;
  init?: boolean | { bits?: number };
  start?: boolean;
  EXPERIMENTAL?: {
    pubsub?: boolean,
    sharding?: boolean,
    dht?: boolean
  };
  config?: {
    Addresses?: {
      Swarm?: string[],
      API?: string,
      Gateway?: string
    },
    Discovery?: {
      MDNS?: {
        Enabled?: boolean,
        Interval?: number
      },
      webRTCStar?: {
        Enabled?: boolean
      }
    },
    Bootstrap?: string[]
  };
  libp2p?: {
    modules?: Libp2pModules
  };
}

interface IPFSConstructor {
  constructor(IPFSOptions): void;
}

type IPFSFactory = Class<IPFS> & IPFSConstructor

declare module "ipfs" {
  declare export default IPFSFactory
  declare export type IPFS = IPFS
}
