// @flow

import type { Callback } from "callback.flow"
import type { Block } from "ipfs-block"
import type { CID } from "cids"
import type { Repo } from "ipfs-repo"

interface BlockService {
  setExchange(Bitswap): void;
  unsetExchange(): void;
  hasExchange(): boolean;
  put(Block, Callback<Error>): void;
  putMany(Block[], Callback<Error>): void;
  get(CID, Callback<Error, Block>): void;
  delete(CID, Callback<Error>): void;
}

interface BlockServiceFactory {
  (Repo): void;
}

type Lib = Class<BlockService> & BlockServiceFactory

declare module "ipfs-block-service" {
  declare export default Lib
  declare export type BlockService = BlockService
  declare export type Repo = Repo
  declare export type CID = CID
  declare export type Block = Block
}

declare module "ipfs-block-service/index" {
  declare export default Lib
}
