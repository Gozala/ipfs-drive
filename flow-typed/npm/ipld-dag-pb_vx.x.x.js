// @flow

import type { Callback } from "callback.flow"
import type { Format, Resolver } from "interface-ipld-format"

interface DAGNode {
  +data: Buffer;
  +links: DAGLink[];
  +serialized: Serialized<self>;
  +size: number;
  +multihash: Multihash;
  toJSON(): JSONode;
  toString(): string;
}

interface JSONode {
  data: number[];
  links: JSONLink[];
  multihash: string;
  size: number;
}

interface NodeConstructor {
  (Buffer, DAGLink[], Serialized<DAGNode>, Multihash): void;
}

interface NodeAPI {
  create(Data, Callback<Error, DAGNode>): void;
  create(Data, Link[], Callback<Error, DAGNode>): void;
  create(Data, HashAlg, Callback<Error, DAGNode>): void;
  create(Data, Link[], HashAlg, Callback<Error, DAGNode>): void;

  addLink(DAGNode, Link, Callback<Error, DAGNode>): void;
  rmLink(DAGNode, string, Callback<Error, DAGNode>): void;
  clone(DAGNode, Callback<Error, DAGNode>): void;
}

type Data = Buffer | string
type Link = DAGLink | JSONLink
type HashAlg = string

type NodeFactory = Class<DAGNode> & NodeConstructor & NodeAPI

interface DAGLink {
  +name: string;
  +size: number;
  +multihash: Multihash;
  toString(): string;
  toJSON(): JSONLink;
}

interface JSONLink {
  name: string;
  size: number;
  multihash: string;
}

interface LinkConstructor {
  constructor(string, number, Multihash): void;
}

interface LinkAPI {
  create(string, number, Multihash | string, Callback<Error, DAGLink>): void;
}

type LinkFactory = Class<DAGLink> & LinkConstructor & LinkAPI

type Multihash = Buffer
type Serialized<a> = Buffer

type DAGResolver = Resolver<Buffer>
type DAGFormat = Format<DAGNode>

declare module "ipld-dag-pb" {
  declare export var DAGNode: NodeFactory
  declare export var DAGLink: LinkFactory
  declare export var resolver: DAGResolver
  declare export var util: DAGFormat

  declare export type Node = DAGNode
  declare export type Link = DAGLink
  declare export type JSONNode = JSONNode
  declare export type JSONLink = JSONLink
}
