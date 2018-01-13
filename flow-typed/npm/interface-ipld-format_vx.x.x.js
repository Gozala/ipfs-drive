// @flow

import type { Callback } from "callback.flow"
import type { CID } from "cids"
import type { CodecName } from "multicodec"

type EncodeError = Error
type DecodeError = Error
type CIDError = Error

// https://github.com/ipld/interface-ipld-format#ipld-format-utils
interface Format<node> {
  serialize(node, Callback<EncodeError, Buffer>): void;
  deserialize(Buffer, Callback<DecodeError, node>): void;
  cid(node, Callback<CIDError, CID>): void;
}

type ResolveError = Error
type TreeError = Error
type LinkError = Error

// https://github.com/ipld/interface-ipld-format#local-resolver-methods
interface Resolver<value> {
  multicodec: CodecName;

  resolve(Buffer, Path, Callback<ResolveError, Resolve<value>>): void;
  tree(Buffer, Callback<TreeError, Entry<value>[]>): void;
  tree(
    Buffer,
    { level: number, values?: boolean },
    Callback<Error, Entry<value>[]>
  ): void;
  isLink(Buffer, Path, Callback<LinkError, Link>): void;
}

type Path = string
type Link = { "/": CID }
type Entry<value> = { [Path]: value }

interface Resolve<value> {
  remainderPath: Path;
  value: Link | value;
}

declare module "interface-ipld-format" {
  declare export type Format<a> = Format<a>
  declare export type Resolver<a> = Resolver<a>
  declare export type Resolve<a> = Resolve<a>
  declare export type Path = Path
  declare export type Link = Link
  declare export type Entry = Entry
  declare export type CID = CID
  declare export type EncodeError = EncodeError
  declare export type DecodeError = DecodeError
  declare export type CIDError = CIDError
  declare export type ResolveError = ResolveError
  declare export type TreeError = TreeError
  declare export type LinkError = LinkError
  declare export type CodecName = CodecName
}
