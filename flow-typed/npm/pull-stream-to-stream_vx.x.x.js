// @flow

import type { Callback } from "callback.flow"
import type { Source, Through, Sink, Duplex } from "pull-stream"
import stream from "stream"
type Readable = typeof stream.Readable
type DuplexStream = typeof stream.Duplex
type Writable = typeof stream.Writable

interface PullStreamToStream {
  (Duplex<Error, Buffer>): stream.Duplex;
  (Sink<Error, Buffer>): Writable;
  (Sink<Error, Buffer>, Source<Error, Buffer>): stream.Duplex;
  source(Source<Error, Buffer>): Readable;
  sink<x>(Sink<x, Buffer>): Writable;
}

declare module "pull-stream-to-stream" {
  declare export default PullStreamToStream
}
