// @flow

import type { Callback } from "callback.flow"
import type { Factory } from "factory.flow"
import type { Connection } from "interface-connection"
import type { PeerInfo } from "peer-info"

interface Listener {
  // TODO: Figure out what the first argument `rawConn` is here.
  // https://github.com/multiformats/js-multistream-select/blob/master/src/listener/index.js#L37
  // One one hand it is passed to `Connection` that expects `PeerInfo` but on
  // the other hand it's also passed to `pull` which suggests it's one of the
  // pull streams things.
  handle(PeerInfo, Callback<ListenError>): void;
  addHandler(Protocol, ConnectionHandler): void;
  addHandler(Protocol, ConnectionHandler, ProtocolMatchHandler): void;
}

interface ConnectionHandler {
  (Protocol, Connection): void;
}

interface MatchError extends Error {}
interface ListenerError extends Error {}
interface ProtocolMatchHandler {
  (own: Protocol, sender: Protocol, Callback<MatchError, Boolean>): void;
}

type ListenerFactory = Factory<Listener>

declare module "multistream-select/src/listener/index" {
  declare export default ListenerFactory
}

declare module "multistream-select/src/listener" {
  declare export default ListenerFactory
  declare export type Connection = Connection
  declare export type ConnectionHandler = ConnectionHandler
  declare export type ProtocolMatchHandler = ProtocolMatchHandler
  declare export type Listener = Listener
  declare export type Protocol = Protocol
  declare export type ListenerError = ListenerError
  declare export type MatchError = MatchError
}

declare module "multistream-select/src/listener/match-exact" {
  declare export default ProtocolMatchHandler
  declare export type ProtocolMatchHandler = ProtocolMatchHandler
  declare export type MatchError = MatchError
  declare export type Protocol = Protocol
}

declare module "multistream-select/src/listener/match-semver" {
  declare export default ProtocolMatchHandler
  declare export type ProtocolMatchHandler = ProtocolMatchHandler
  declare export type MatchError = MatchError
  declare export type Protocol = Protocol
}

interface Dialer {
  // TODO: Firgure out if rawConn is PeerInfo
  // https://github.com/multiformats/js-multistream-select/blob/f0d6e5cf522801ace76bdffd19b750c0b158e911/src/dialer/index.js
  handle(PeerInfo, Callback<DialError>): void;
  select(Protocol, Callback<SelectError, Connection>): void;
  ls(Callback<LSError, Protocol[]>): void;
}

interface DialError extends Error {}
interface SelectError extends Error {}
interface LSError extends LSError {}

type DialerFactory = Factory<Dialer>

declare module "multistream-select/src/dialer/index" {
  declare export default DialerFactory
}

declare module "multistream-select/src/dialer" {
  declare export default DialerFactory
  declare export type Connection = Connection
  declare export type Dialer = Dialer
  declare export type Protocol = Protocol
  declare export type DialError = DialError
  declare export type SelectError = SelectError
  declare export type LSError = LSError
}

declare module "multistream-select" {
  declare export var Listener: ListenerFactory
  declare export var Dialer: DialerFactory
  declare export var matchSemver: ProtocolMatchHandler
  declare export var matchExact: ProtocolMatchHandler

  declare export type Connection = Connection
  declare export type ConnectionHandler = ConnectionHandler
  declare export type ProtocolMatchHandler = ProtocolMatchHandler
  declare export type Protocol = Protocol
  declare export type ListenerError = ListenerError
  declare export type MatchError = MatchError
  declare export type DialError = DialError
  declare export type SelectError = SelectError
  declare export type LSError = LSError
}

type Protocol = string
