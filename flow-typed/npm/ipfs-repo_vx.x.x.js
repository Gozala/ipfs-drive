// @flow

import type { Callback } from "callback.flow"
import type {
  Key,
  Datastore,
  Query,
  QueryResult,
  QueryEntry,
  Filter,
  Order
} from "interface-datastore"
import type { Block } from "ipfs-block"
import type { CID } from "cids"
import type { Multiaddr, MultiaddrString } from "multiaddr"

interface Repo {
  open(Callback<Error>): void;
  init(JSON, Callback<Error>): void;
  close(Callback<Error>): void;
  exists(Callback<Error, boolean>): void;

  root: Datastore<Buffer>;
  blocks: Block;
  datastore: Datastore<Buffer>;
  config: Config;
  apiAddr: APIAddr;
}

interface RepoFactory {
  (repoPath: string): void;
  (repoPath: string, RepoConfig): void;
}

interface RepoConfig {
  lock?: "fs" | "memory";
  storageBackends?: {
    root?: Datastore<Buffer>,
    blocks?: Datastore<Buffer>,
    keys?: Datastore<Buffer>,
    datastore?: Datastore<Buffer>
  };
  storageBackendOptions?: {
    root?: StorageBackendOptions,
    blocks?: StorageBackendOptions,
    keys?: StorageBackendOptions,
    datastore?: StorageBackendOptions
  };
}

interface StorageBackendOptions {
  sharding?: boolean;
  extension?: string;
  db?: Object;
}

declare module "ipfs-repo/src/index" {
  declare export default RepoFactory
}

declare module "ipfs-repo" {
  declare export default RepoFactory
  declare export type Repo = Repo
  declare export type RepoConfig = RepoConfig
  declare export type StorageBackendOptions = StorageBackendOptions
  declare export type Blocks = Blocks
  declare export type Blockstore = Blocks
  declare export type Config = Config
  declare export type JSON = JSON
  declare export type Version = Version
  declare export type APIAddr = APIAddr
}

interface Blocks {
  put(Block, Callback<Error>): void;
  putMany(Block[], Callback<Error>): void;
  get(CID, Callback<Error, Buffer>): void;
}

interface BlockstoreFactory {
  (Datastore<Buffer>, { sharding?: boolean }, Callback<Error, Blocks>): void;
}

declare module "ipfs-repo/src/blockstore" {
  declare export default BlockstoreFactory
  declare export type Blocks = Blocks
}

interface Config {
  set(JSON, Callback<Error>): void;
  set(string, JSON, Callback<Error>): void;
  get(Callback<Error, JSON>): void;
  get(string, Callback<Error, JSON>): void;
  exists(Callback<Error, boolean>): void;
}
type JSON = null | boolean | number | string | JSON[] | { [string]: JSON }

interface ConfigFactory {
  (Datastore<Buffer>): Config;
}

declare module "ipfs-repo/src/config" {
  declare export default ConfigFactory
  declare export type Config = Config
  declare export type JSON = JSON
}

interface Version {
  set(number, Callback<Error>): void;
  get(Callback<Error, number>): void;
  exists(Callback<Error, boolean>): void;
  check(number, Callback<Error>): void;
}

interface VersionFactory {
  (Datastore<Buffer>): Version;
}

declare module "ipfs-repo/src/version" {
  declare export default VersionFactory
  declare export type Version = Version
}

interface APIAddr {
  get(Callback<Error, string>): void;
  set(string, Callback<Error>): void;
  delete(Callback<Error, boolean>): void;
}

interface APIAddrFactory {
  (Datastore<Buffer>): APIAddr;
}

declare module "ipfs-repo/src/api-addr" {
  declare export default APIAddrFactory
  declare export type APIAddr = APIAddr
}
