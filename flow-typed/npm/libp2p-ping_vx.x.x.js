// @flow

import type { EventEmitter } from "events"
import type { PeerInfo } from "peer-info"
import type { Swarm } from "libp2p-swarm"

interface Ping extends EventEmitter {
  stop(): void;
}

interface PingFactory {
  (Swarm, PeerInfo): void;
}

type PingModule = Class<Ping> & PingFactory

declare module "libp2p-ping/src/ping" {
  declare export default PingModule
}

interface Mount {
  (Swarm): void;
}

interface Unmount {
  (Swarm): void;
}

declare module "libp2p-ping/src/handler" {
  declare export var mount: Mount
  declare export var unmount: Unmount
}

interface Handler {
  mount: Mount;
  unmount: Unmount;
}

type PingLib = PingModule & Handler

declare module "libp2p-ping" {
  declare export default PingLib
  declare export type Ping = Ping
  declare export type Handler = Handler
}
