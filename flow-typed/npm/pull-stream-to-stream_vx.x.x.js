// @flow

import type { Callback } from "callback.flow"
import type { Source, Through, Sink, Duplex } from "pull-stream"
import type { Readable, Writable } from "stream"
import * as stream from "stream"

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
