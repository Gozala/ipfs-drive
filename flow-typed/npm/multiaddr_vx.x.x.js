// @flow

opaque type Code: number = number
type Size = number

type Protocol = {
  code: Code,
  size: Size,
  name: string,
  resolvable: boolean
}

interface ProtocolsTable {
  (string | number): Protocol;
  lengthPrefixedVarSize: number;
  V: number;
  table: Array<[number, number, string]>;
  names: { [string]: Protocol };
  codes: { [number]: Protocol };
  object(Code, Size, string, boolean): Protocol;
}

declare module "multiaddr/src/protocols-table" {
  declare export type Code = Code
  declare export type Size = Size
  declare export type Protocol = Protocol

  declare export default ProtocolsTable
}

type Name$Address = [string, string]
type Code$Buffer = [number, Buffer]
class ParseError extends Error {}

interface Codec {
  stringToStringTuples(string): Name$Address[];
  stringTuplesToString(Name$Address[]): string;
  tuplesToStringTuples(Code$Buffer[]): Name$Address[];
  stringTuplesToTuples(Name$Address[]): Code$Buffer[];

  bufferToTuples(Buffer): Code$Buffer[];
  tuplesToBuffer(Code$Buffer[]): Buffer;

  bufferToString(Buffer): string;
  stringToBuffer(string): Buffer;

  fromString(string): Buffer;
  fromBuffer(Buffer): Buffer;
  validateBuffer(mixed): void;
  isValidBuffer(mixed): boolean;
  cleanPath(string): string;

  ParseError(string): ParseError;
  protoFromTuple(Name$Address | Code$Buffer): Protocol;

  sizeForAddr(Protocol, Buffer): number;
}

declare module "multiaddr/src/codec" {
  declare export type Name$Address = Address
  declare export type Code$Buffer = Code$Buffer
  declare export type ParseError = ParseError

  declare export default Codec
}

interface Convert {
  (Protocol, Buffer): string;
  (Protocol, string): Buffer;
  toString(Protocol, Buffer): string;
  toBuffer(Protocol, string): Buffer;
}

declare module "multiaddr/src/convert" {
  declare export default Convert
}

opaque type MultiaddrString: string = string

export type Options = {
  family: string,
  host: string,
  transport: string,
  port: string
}

export type NodeAddress = {
  family: string,
  address: string,
  port: string
}

export interface Multiaddr {
  buffer: Buffer;
  toString(): MultiaddrString;
  toOptions(): Options;
  inspect(): string;
  protos(): Protocol[];
  protoCodes(): Code[];
  protoNames(): string[];
  tuples(): Array<[Code, Buffer]>;
  stringTuples(): Array<[Code, string | number]>;
  encapsulate(string | Buffer | Multiaddr): Multiaddr;
  decapsulate(string | Buffer | Multiaddr): Multiaddr;
  getPeerId(): ?string;
  equals(Multiaddr): boolean;
  nodeAddress(): NodeAddress;
  isThinWaistAddress(Multiaddr): boolean;
  fromStupidString(string): empty;
}

type MultiaddrFactory = Class<Multiaddr> & {
  Buffer: typeof Buffer,
  protocols: ProtocolsTable,
  (string | Buffer | Multiaddr): Multiaddr,
  constructor(string | Buffer | Multiaddr): Multiaddr,
  fromNodeAddress(NodeAddress, transport: string): Multiaddr,
  isMultiaddr(mixed): boolean,
  isName(mixed): boolean,
  resolve(mixed, Callback<Error, void>): void
}

declare module "multiaddr/src/index" {
  declare export default Lib
}

declare module "multiaddr" {
  declare export default MultiaddrFactory
  declare export type MultiaddrFactory = MultiaddrFactory
  declare export type Code = Code
  declare export type Size = Size
  declare export type ParseError = ParseError
  declare export type Multiaddr = Multiaddr
  declare export type MultiaddrString = MultiaddrString
  declare export type Options = Options
  declare export type NodeAddress = NodeAddress
  declare export type ProtocolsTable = ProtocolsTable
  declare export type Protocol = Protocol
}
