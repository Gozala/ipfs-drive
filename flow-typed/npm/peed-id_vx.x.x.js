// @flow

import type { Callback } from "callback.flow"
import * as crypto from "libp2p-crypto"

const { RsaPublicKey, RsaPrivateKey } = crypto.key.rsa

interface JSONPeerId {
  id: string;
  privKey: string;
  pubKey: string;
}

interface PeerId {
  id: Buffer;
  privKey: RsaPrivateKey;
  pubKey: RsaPublicKey;

  toJSON(): JSONPeerId;
  toPrint(): JSONPeerId;
  toB58String(): string;
  toBytes(): Buffer;
  toHexString(): string;
  isEqual(PeerId): boolean;
  marshalPubKey(): Buffer;
  marshalPrivKey(): Buffer;
  isValid(Callback<Error>): void;
}

type CreateOptions = {
  bits?: number
}

type Lib = Class<PeerId> & {
  constructor(id: Buffer, privKey: RsaPrivateKey, pubKey: RsaPublicKey): void,
  create(CreateOptions, Callback<Error, PeerId>): void,
  create(Callback<Error, PeerId>): void,
  createFromHexString(string): PeerId,
  createFromBytes(Buffer): PeerId,
  createFromB58String(string): PeerId,
  createFromPubKey(string | Buffer, Callback<Error, PeerId>): void,
  createFromPrivKey(string | Buffer, Callback<Error, PeerId>): void,
  createFromJSON(JSONPeerId, Callback<Error, PeerId>): void,
  isPeerId(mixed): boolean
}

declare module "peer-id" {
  declare export default Lib
  declare export type PeerId = PeerId
  declare export type JSONPeerId = JSONPeerId
  declare export type CreateOptions = CreateOptions

  declare export type PublicKey = RsaPublicKey
  declare export type PrivateKey = RsaPrivateKey
}

declare module "peer-id/src/index" {
  declare export default Lib
}
