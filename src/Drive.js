// @flow

import * as path from "path"
import * as url from "url"
import * as mime from "mime-types"
import fileType from "file-type"
import pull from "pull-stream"
import peek from "pull-peek"
import toStream from "pull-stream-to-stream"
import { exporter } from "ipfs-unixfs-engine"
import type { Source } from "pull-stream"
import type { Directory, File, ExportEntry } from "ipfs-unixfs-engine"
import type { IPLDResolver } from "ipld-resolver"
import type { Block } from "ipfs-block"

export interface IPFSNode {
  _ipldResolver: IPLDResolver<Block>;
}

export class Drive {
  node: IPFSNode
  constructor(node: IPFSNode) {
    this.node = node
  }
  static normalizePath(path: string) {
    const path2 = path.startsWith("/ipfs/") ? path.substr(6) : path
    const path3 = path2.endsWith("/")
      ? path2.substr(0, path2.length - 1)
      : path2
    return path3
  }
  entry(ipfsPath: string): Promise<DirectoryEntry | FileEntry> {
    return new Promise((resolve, reject) => {
      const entryPath = Drive.normalizePath(ipfsPath)
      const maxDepth = entryPath.split("/").length

      const exportedEntries = exporter(entryPath, this.node._ipldResolver, {
        maxDepth
      })
      return pull(
        exportedEntries,
        pull.collect((error, entries) => {
          if (error) {
            if (error.message.startsWith("multihash length inconsistent")) {
              reject(new InvalidCID(error))
            } else if (error.message.startsWith("Non-base58 character")) {
              reject(new InvalidCID(error))
            } else {
              reject(new IOError(error))
            }
          } else if (entries) {
            switch (entries.length) {
              case 0:
                return reject(new EntryNotFound(entryPath))
              case 1: {
                const [node] = entries
                return resolve(Entry.from(this, path.dirname(entryPath), node))
              }
              default: {
                const [node, ...nodes] = entries
                return resolve(
                  new DirectoryEntry(this, path.dirname(entryPath), node, nodes)
                )
              }
            }
          } else {
            reject(error)
          }
        })
      )
    })
  }
}

class Entry {
  static from(fs, parentPath, node) {
    if (node.type === "file") {
      return new FileEntry(parentPath, node)
    } else {
      return new DirectoryEntry(fs, parentPath, node, null)
    }
  }
}

export class FileEntry {
  type: "file" = "file"
  node: File
  name: string
  path: string
  hash: string

  _fileType: Promise<?FileType>
  _nodeContent: Source<Error, Buffer>
  constructor(parentPath: string, node: File) {
    this.node = node
    this.name = node.name
    this.path = `/ipfs/${parentPath}/${this.name}`
    this.hash = node.hash
    this.type = "file"
  }
  peek(): FileEntry {
    if (this._nodeContent == null) {
      this._fileType = new Promise((resolve, reject) => {
        this._nodeContent = pull(
          this.node.content,
          peek((end, data) => {
            resolve(data != null ? fileType(data) : data)
          })
        )
      })
    }
    return this
  }

  fileType(): Promise<?FileType> {
    return this.peek()._fileType
  }
  contentStream(): Readable {
    return toStream.source(this.peek()._nodeContent)
  }
  contentBuffer(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      pull(
        this.peek()._nodeContent,
        pull.collect((error, chunks) => {
          if (error) {
            reject(error)
          } else if (chunks) {
            resolve(Buffer.concat(chunks))
          } else {
            reject(error)
          }
        })
      )
    })
  }
}

export interface FileType {
  ext: string;
  mime: string;
}

export class DirectoryEntry {
  fs: Drive
  node: Directory
  nodes: null | ExportEntry[]
  name: string
  path: string
  hash: string
  type: "directory" = "directory"
  _entries: Array<DirectoryEntry | FileEntry>
  constructor(
    fs: Drive,
    parentPath: string,
    node: Directory,
    nodes: null | ExportEntry[]
  ) {
    this.fs = fs
    this.nodes = nodes
    this.node = node
    this.name = node.name
    this.path = path.normalize(`/ipfs/${parentPath}/${this.name}/`)
    this.hash = node.hash
    this.type = "directory"
  }
  async entries(): Promise<Array<DirectoryEntry | FileEntry>> {
    if (this._entries) {
      return this._entries
    } else if (this.nodes != null) {
      this._entries = this.nodes.map(node =>
        Entry.from(this.fs, this.path, node)
      )
      return this._entries
    } else {
      const directory = await this.fs.entry(this.path)
      this._entries = await directory.entries()
      return this._entries
    }
  }
}

export class IOError {
  code: 500 = 500
  reason: Error
  stack: string
  message: string
  constructor(error: Error) {
    this.code = 500
    this.reason = error
    this.stack = error.stack
    this.message = error.message
  }
}

export class InvalidCID {
  code: 404 = 404
  reason: Error
  stack: string
  message: string
  constructor(error: Error) {
    this.code = 404
    this.reason = error
    this.stack = error.stack
    this.message = error.message
  }
}

export class EntryNotFound {
  code: 404 = 404
  path: Path
  stack: string
  message: string
  constructor(path: Path) {
    this.code = 404
    this.path = path
    this.stack = new Error().stack
    this.message = this.toString()
  }
  toString() {
    return `Entry \`/ipfs/${this.path}\` not found`
  }
}

export default Drive
