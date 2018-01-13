// @flow

import type { Factory } from "factory.flow"
import type { Callback } from "callback.flow"
import type { PeerInfo } from "peer-info"
import type { PeerBook, Peer } from "peer-book"
import type {
  DialError,
  ListenError,
  ConnectionHandler,
  ProtocolMatchHandler,
  Protocol
} from "multistream-select"
import type { Multiaddr } from "multiaddr"
import type { Transport, ListenerHandler } from "interface-transport"
import type { Muxer, MuxedConnection } from "interface-stream-muxer"

interface Swarm {
  dial(Peer, Protocol, Callback<DialError>): void;
  hangUp(Peer, Callback<HangUpError>): void;
  listen(Callback<ListenError>): void;
  handle(Protocol, ConnectionHandler): void;
  handle(Protocol, ConnectionHandler, ProtocolMatchHandler): void;
  unhandle(Protocol): void;
  close(Callback<CloseError>): void;
  hasTransports(): boolean;

  transport: SwarmTransport;
  connection: SwarmConnection;
}

interface SwarmTransport {
  add<options>(TransportID, Transport<options>, options, Callback<void>): void;
  dial<options>(
    TransportID,
    Transport<options>,
    Multiaddr,
    Callback<Connection>
  ): void;
  listen<options>(
    TransportID,
    options,
    ListenerHandler,
    Callback<ListenError>
  ): void;
  close(TransportID, Callback<CloseError>): void;
}

type TransportID = string
interface HangUpError extends Error {}
interface CloseError extends Error {}

type SwarmTransportFactory = Swarm => SwarmTransport

declare module "libp2p-swarm/src/transport" {
  declare export default SwarmTransportFactory
  declare export type TransportID = TransportID
  declare export type SwarmTransport = SwarmTransport
  declare export type Multiaddr = Multiaddr
  declare export type Connection = Connection
  declare export type ListenerHandler = ListenerHandler
  declare export type CloseError = CloseError
}

interface SwarmConnection {
  addUpgrade(): void;
  addStreamMuxer(Muxer): void;
  reuse(): void;
  crypto(): void;
  crypto(CryptoTag, Encrypt): void;
  enableCircuitRelay(RelayOptions): void;
}

type CryptoTag = string

interface Encrypt {
  (local: PeerId, plain: Connection): Connection;
  (local: PeerId, plain: Connection, remote: PeerId): Connection;
  (local: PeerId, plain: Connection, InitCallback): Connection;
  (local: PeerId, plain: Connection, remote: PeerId, InitCallback): Connection;
}

interface RelayOptions {
  enabled?: boolean;
  hop?: { enabled?: boolean, active?: boolean };
}

type InitCallback = Callback<Error>
type SwarmConnectionFactory = Swarm => SwarmConnection

declare module "libp2p-swarm/src/connection" {
  declare export default SwarmConnectionFactory
  declare export type SwarmConnection = SwarmConnection
  declare export type CryptoTag = CryptoTag
  declare export type Encrypt = Encrypt
  declare export type RelayOptions = RelayOptions
  declare export type Peer = Peer
  declare export type PeerId = PeerId
  declare export type Connection = Connection
  declare export type InitCallback = InitCallback
  declare export type Muxer = Muxer
}

interface SwarmConstructor {
  (PeerInfo, PeerBook): Swarm;
}

type SwarmFactory = Factory<Swarm, SwarmConstructor>

declare module "libp2p-swarm" {
  declare export default SwarmFactory
  declare export type Protocol = Protocol
  declare export type DialError = DialError
  declare export type ConnectionHandler = ConnectionHandler
  declare export type ProtocolMatchHandler = ProtocolMatchHandler
  declare export type HangUpError = HangUpError
  declare export type ListenError = ListenError

  declare export type TransportID = TransportID
  declare export type SwarmTransport = SwarmTransport
  declare export type Multiaddr = Multiaddr
  declare export type Connection = Connection
  declare export type ListenerHandler = ListenerHandler
  declare export type CloseError = CloseError

  declare export type SwarmConnection = SwarmConnection
  declare export type CryptoTag = CryptoTag
  declare export type Encrypt = Encrypt
  declare export type RelayOptions = RelayOptions
  declare export type Peer = Peer
  declare export type PeerId = PeerId
  declare export type Connection = Connection
  declare export type InitCallback = InitCallback
  declare export type Muxer = Muxer
}
