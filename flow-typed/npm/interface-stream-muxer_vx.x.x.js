// @flow

import type { Callback } from "callback.flow"
import type { Connection } from "interface-connection"

interface Muxer extends Attach {
  multicodec: string;
  listener(Connection): MuxedConnection;
  dialer(Connection): MuxedConnection;
}

interface Attach {
  (Connection, boolean): MuxedConnection;
}

interface MuxedConnection {
  newStream(Callback<Error, Connection>): void;

  on("stream", OnConnection): void;
  once("stream", OnConnection): void;
  on("error", OnError): void;
  once("error", OnError): void;
  on("close", OnClose): void;
  once("close", OnClose): void;

  removeListener(
    "stream" | "error" | "close",
    OnConnection | OnError | OnClose
  ): MuxedConnection;
  setMaxListeners(n: number): MuxedConnection;
  getMaxListeners(): number;
  listenerCount(string): number;
  eventNames(): string[];
}

type OnConnection = Connection => void
type OnError = Error => void
type OnClose = () => void

declare module "interface-stream-muxer" {
  declare export type Muxer = Muxer
  declare export type Attach = Attach
  declare export type MuxedConnection = MuxedConnection
  declare export type Connection = Connection
  declare export type OnConnection = OnConnection
  declare export type OnError = OnError
  declare export type OnClose = OnClose
}
