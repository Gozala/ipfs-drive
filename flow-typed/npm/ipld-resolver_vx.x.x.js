// @flow

import type { Callback } from "callback.flow"
import type { Source } from "pull-stream"
import type { CID } from "cids"
import type { Format, Resolver, CodecName } from "interface-ipld-format"
import type { BlockService } from "ipfs-block-service"

type PutOptions = { cid: CID } | { hashAlg: string, format: string }

type GetOptions = { localResolve: boolean }

type GetResult<value> = { value: value, remainderPath: string }

type GetTreeOptions = { recursive: boolean }

interface IPLDResolver<value> {
  put(value, PutOptions, Callback<Error, CID>): void;

  get(CID, Callback<Error, GetResult<value>>): void;
  get(CID, string, Callback<Error, GetResult<value>>): void;
  get(CID, string, GetOptions, Callback<Error, GetResult<value>>): void;

  getStream(CID): Source<Error, value>;
  getStream(CID, string): Source<Error, value>;
  getStream(CID, string, GetOptions): Source<Error, value>;

  treeStream(CID): Source<Error, value>;
  treeStream(CID, string): Source<Error, value>;
  treeStream(CID, string, GetTreeOptions): Source<Error, value>;

  remove(CID, Callback<Error>): void;

  support: IPLDResolverSupport<value>;
}

interface IPLDResolverSupport<value> {
  add(CodecName, Resolver<value>, Format): void;
  rm(CodecName): void;
}

class IPLDResolverFactory<a> implements IPLDResolver<a> {
  put: *
  get: *
  getStream: *
  treeStream: *
  remove: *
  support: *
  constructor(BlockService) {}
}

declare module "ipld-resolver" {
  declare export default class Lib<a> extends IPLDResolverFactory<a> {}
  declare export type IPLDResolver<a> = IPLDResolver<a>
  declare export type IPLDResolverSupport<a> = IPLDResolverSupport<a>
  declare export type CID = CID
  declare export type Format<a> = Format<a>
  declare export type Resolver<a> = Resolver<a>
  declare export type CodecName = CodecName
  declare export type BlockService = BlockService
  declare export type PutOptions = PutOptions
  declare export type GetOptions = GetOptions
  declare export type GetResult = GetResult
  declare export type GetTreeOptions = GetTreeOptions
}
