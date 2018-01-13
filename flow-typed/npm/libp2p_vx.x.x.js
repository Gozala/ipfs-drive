// @flow

import type { Factory } from "factory.flow"
import type { Callback } from "callback.flow"
import type { PeerId } from "peer-id"
import type { PeerInfo } from "peer-info"
import type { PeerBook, Peer } from "peer-book"
import type { Multiaddr } from "multiaddr"
import type { Connection } from "interface-connection"
import type { Ping } from "libp2p-ping"
import type { Protocol, Swarm } from "libp2p-swarm"
import type { DHT, DHTOptions, DHTFactory } from "libp2p-kad-dht"
import type { Transport } from "interface-transport"
import type { Muxer } from "interface-stream-muxer"
import type { Encrypt } from "libp2p-swarm"
import type { Discovery } from "libp2p-mdns"

interface Libp2p {
  start(Callback<Error>): void;
  stop(Callback<Error>): void;

  dial(Peer): void;
  dial(Peer, Protocol): void;
  dial(Peer, OnDial): void;
  dial(Peer, Protocol, OnDial): void;

  hangUp(Peer, OnHangUp): void;

  isStarted: () => boolean;
  ping: (Peer, Callback<Error, Ping>) => void;

  peerBook: PeerBook;
  peerInfo: PeerInfo;
  dht: DHT;
}

interface PeerRouting {
  findPeer(PeerId, OnFindPeer): void;
}

type OnFindPeer = () => void

type OnDial = Callback<DailError, Connection>
type OnHangUp = Callback<HangUpError>

interface DailError extends Error {}
interface HangUpError extends Error {}

interface Libp2pConstructor {
  (Libp2pModules, PeerInfo, PeerBook, Libp2pOptions): void;
}

interface Libp2pModules {
  DHT: ?DHTFactory;
  transport?: Transport<>[];
  connection?: {
    muxer?: Muxer[],
    crypto?: Encrypt[]
  };
  discovery?: Discovery[];
}

interface Libp2pOptions {
  relay?: boolean;
  DHT?: DHTOptions;
}

type Libp2pFactory = Factory<Libp2p, Libp2pConstructor>

declare module "libp2p" {
  declare export default Libp2pFactory
  declare export type Libp2p = Libp2p
  declare export type Libp2pModules = Libp2pModules
  declare export type Libp2pOptions = Libp2pOptions

  declare export type PeerRouting = PeerRouting
  declare export type OnFindPeer = OnFindPeer

  declare export type OnDial = OnDial
  declare export type OnHangUp = OnHangUp

  declare export type DailError = DailError
  declare export type HangUpError = HangUpError

  declare export type PeerId = PeerId
  declare export type PeerInfo = PeerInfo
  declare export type PeerBook = PeerBook
  declare export type Peer = Peer
  declare export type Multiaddr = Multiaddr
  declare export type Connection = Connection
  declare export type Ping = Ping
  declare export type Protocol = Protocol
  declare export type Swarm = Swarm
  declare export type DHT = DHT
  declare export type DHTOptions = DHTOptions
  declare export type DHTFactory = DHTFactory
  declare export type Transport<a> = Transport<a>
  declare export type Muxer = Muxer
  declare export type Encrypt = Encrypt
  declare export type Discovery = Discovery
}
