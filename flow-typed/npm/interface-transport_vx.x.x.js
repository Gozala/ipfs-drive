// @flow

import type { Callback } from "callback.flow"
import type { Multiaddr } from "multiaddr"
import type { Connection, AddrsError } from "interface-connection"

interface Transport<dialOptions = void> {
  dial(Multiaddr): void;
  dial(Multiaddr, dialOptions): Connection;
  dial(Multiaddr, DialCallback): Connection;
  dial(Multiaddr, dialOptions, DialCallback): Connection;

  createListener(ListenerHandler): Listener;
}

interface TimeoutError extends Error {}
type DialError = AddrsError | TimeoutError
type DialCallback = Callback<DialError, Multiaddr[]>

type ListenerHandler = Connection => void
type ListenCallback = Callback<AddrsError, Multiaddr[]>

interface Listener {
  listen(Multiaddr, ListenCallback): void;
  getAddrs(AddrsCallback): void;
  close(): void;
  close(CloseOptions): void;
  close(CloseCallback): void;
  close(CloseOptions, CloseCallback): void;

  on("listening", () => void): Listener;
  once("listening", () => void): Listener;
  on("close", () => void): Listener;
  once("close", () => void): Listener;
  on("connection", (Connection) => void): Listener;
  once("connection", (Connection) => void): Listener;
  on("error", (Error) => void): Listener;
  once("error", (Error) => void): Listener;
  removeListener(ListenerEvents, Function): Listener;
  setMaxListeners(n: number): Listener;
  getMaxListeners(): number;
  listenerCount(string): number;
  eventNames(): string[];
}

type ListenerEvents = "listening" | "close" | "connection" | "error"
type AddrsCallback = Callback<AddrsError, Multiaddr[]>
interface CloseOptions {
  timeout?: number;
}
type CloseCallback = Callback<void>

interface TransportConstructor<options = void> {
  (options): void;
}

type TransportFactory<transportOptions, dialOptions> = Factory<
  Transport<dialOptions>,
  TransportConstructor<transportOptions>
>

declare module "interface-transport" {
  declare export type Transport<a = void> = Transport<a>
  declare export type TransportFactory<t, d> = TransportFactory<t, d>
  declare export type Connection = Connection
  declare export type TimeoutError = TimeoutError
  declare export type AddrsError = AddrsError
  declare export type DialError = DialError
  declare export type DialCallback = DialCallback
  declare export type ListenerHandler = ListenerHandler
  declare export type ListenCallback = ListenCallback
  declare export type Listener = Listener
  declare export type ListenerEvents = ListenerEvents
  declare export type AddrsCallback = AddrsCallback
  declare export type CloseOptions = CloseOptions
  declare export type CloseCallback = CloseCallback
}
