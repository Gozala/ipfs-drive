// @flow

import type { Codecs, CodecName } from "multicodec"
opaque type BaseEncodedString: string = string
type Multihash = Buffer

interface SerializedCID {
  codec: string;
  version: number;
  multihash: Multihash;
}

interface CID {
  codec: string;
  version: number;
  multihash: Multihash;
  buffer: Buffer;
  prefix: Buffer;
  toV0(): CID;
  toV1(): CID;
  toBaseEncodedString(): BaseEncodedString;
  toJSON(): SerializedCID;
  equals(CID): boolean;
}

interface CIDFactory {
  (CID): void;
  (Multihash): void;
  (version: number, codec: CodecName, hash: Multihash): void;
}

interface CIDLib {
  codecs: Codecs;
  isCID(mixed): boolean;
  validateCID(mixed): void;
}

type Lib = Class<CID> & CIDFactory & CIDLib

declare module "cids" {
  declare export default Lib
  declare export type Multihash = Multihash
  declare export type BaseEncodedString = BaseEncodedString
  declare export type Codecs = Codecs
  declare export type CodecName = CodecName
  declare export type CID = CID
}
