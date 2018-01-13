// @flow

type bytes = number

type DirectoryType = "directory" | "hamt-sharded-directory"
type DataType = DirectoryType | "raw" | "file" | "metadata" | "symlink"

interface Marshal {
  marshal(): Buffer;
}

interface Unmarshal<a> {
  unmarshal(Buffer): a;
}

interface Data extends Marshal {
  type: DataType;
  addBlockSize(bytes): void;
  removeBlockSize(number): void;
  fileSize(): bytes;
}

interface DataFactory {
  (type: DataType, content?: Buffer): void;
}

type Unixfs = Class<Data> & Unmarshal<Data> & DataFactory

declare module "ipfs-unixfs/src/index" {
  declare export default Unixfs
}

declare module "ipfs-unixfs" {
  declare export default Unixfs
  declare export type Data = Data
  declare export type Marshal = Marshal
  declare export type Unmarshal<a> = Unmarshal<a>
  declare export type DirectoryType = DirectoryType
  declare export type DataType = DataType
}
