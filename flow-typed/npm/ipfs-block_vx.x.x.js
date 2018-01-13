// @flow

import type { CID } from "cids"

interface Block {
  data: Buffer;
  cid: CID;
}

interface BlockFactory {
  (Buffer, CID): void;
}

interface IsBlock {
  isBlock(mixed): boolean;
}

type Lib = Class<Block> & BlockFactory & IsBlock

declare module "ipfs-block" {
  declare export default Lib
  declare export type CID = CID
  declare export type Block = Block
}
