// @flow

type Codec = Buffer

type Codecs = {
  raw: Codec,
  base1: Codec,
  base8: Codec,
  base10: Codec,
  protobuf: Codec,
  cbor: Codec,
  rlp: Codec,
  bencode: Codec,
  multicodec: Codec,
  multihash: Codec,
  multiaddr: Codec,
  multibase: Codec,
  sha1: Codec,
  "sha2-256": Codec,
  "sha2-512": Codec,
  "sha3-224": Codec,
  "sha3-256": Codec,
  "sha3-384": Codec,
  "sha3-512": Codec,
  "shake-128": Codec,
  "shake-256": Codec,
  "keccak-224": Codec,
  "keccak-256": Codec,
  "keccak-384": Codec,
  "keccak-512": Codec,
  blake2b: Codec,
  blake2s: Codec,
  ip4: Codec,
  ip6: Codec,
  tcp: Codec,
  udp: Codec,
  dccp: Codec,
  sctp: Codec,
  udt: Codec,
  utp: Codec,
  ipfs: Codec,
  http: Codec,
  https: Codec,
  https: Codec,
  onion: Codec,
  "git-raw": Codec,
  "dag-pb": Codec,
  "dag-cbor": Codec,
  "eth-block": Codec,
  "eth-block-list": Codec,
  "eth-tx-trie": Codec,
  "eth-tx": Codec,
  "eth-tx-receipt-trie": Codec,
  "eth-tx-receipt": Codec,
  "eth-tx-receipt": Codec,
  "eth-account-snapshot": Codec,
  "eth-storage-trie": Codec,
  "bitcoin-block": Codec,
  "bitcoin-tx": Codec,
  "stellar-block": Codec,
  "stellar-tx": Codec,
  "torrent-info": Codec,
  "torrent-file": Codec
}

type Bytes = number[]

interface Util {
  numberToBuffer(number): Buffer;
  bufferToNumber(Buffer): number;
  varintBufferEncode(Buffer): Buffer;
  varintBufferDecode(Buffer | Bytes): Buffer;
}

type CodecName = $Keys<Codecs>
type NameTable = { [string]: CodecName }

interface Lib {
  addPrefix(CodecName, Buffer): Buffer;
  addPrefix(code: Buffer, Buffer): Buffer;
  rmPrefix(Buffer): Buffer;
  getCodec(Buffer): CodecName;
}

declare module "multicodec" {
  declare export default Lib
  declare export type Codec = Codec
  declare export type Codecs = Codecs
  declare export type Bytes = Bytes
  declare export type CodecName = CodecName
}

declare module "multicodec/src/index" {
  declare export default Lib
}

declare module "multicodec/src/base-table" {
  declare export default Codecs
}

declare module "multicodec/src/varint-table" {
  declare export default Codecs
}

declare module "multicodec/src/name-table" {
  declare export default NameTable
}

declare module "multicodec/src/util" {
  declare export default Util
}
