// @flow

import type { IPLDResolver } from "ipld-resolver"
import type { Block } from "ipfs-block"
import type { Readable } from "stream"
import type { CID } from "cids"
import type { Source, Duplex } from "pull-stream"

type Importer = Duplex<Error, Stat, Error, ImportEntry>
type Exporter = Source<ExportError, ExportEntry>

interface Entry {
  name: string;
  depth: number;
  path: Path;
  hash: Hash;
  size: number;
}

type Hash = string

interface Directory extends Entry {
  type: "dir";
  pathRest: string;
  parent: ?Directory;
}

interface File extends Entry {
  type: "file";
  content: Source<Error, Buffer>;
}

type ExportEntry = Directory | File
interface ExportError extends Error {}

type Content = Readable | Buffer | Source<Error, Buffer>

interface ExporterFactory {
  (CID | Path, IPLDResolver<Block>, ?ExporterOptions): Exporter;
}

interface ImporterFactory {
  (IPLDResolver<Block>, ?ImporterOptions): Importer;
}

interface ExporterOptions {
  maxDepth?: number;
}

interface ImporterOptions {
  chunker?: "fixed";
}

interface ImportEntry {
  path: Path;
  content: Content;
}

type Stat = { multihash: Buffer, size: number, path: Path }

type Path = string

declare module "ipfs-unixfs-engine" {
  declare export var importer: ImporterFactory
  declare export var exporter: ExporterFactory

  declare export type CID = CID
  declare export type Block = Block
  declare export type Importer = Importer
  declare export type Exporter = Exporter

  declare export type Path = Path
  declare export type Stat = Stat

  declare export type Entry = Entry
  declare export type Hash = Hash
  declare export type Directory = Directory
  declare export type File = File
  declare export type ExportEntry = ExportEntry
  declare export type ExportError = ExportError
  declare export type Content = Content
  declare export type ExporterOptions = ExporterOptions
  declare export type ImporterOptions = ImporterOptions
  declare export type ImportEntry = ImportEntry
}
