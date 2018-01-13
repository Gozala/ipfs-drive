// flow-typed signature: 5dad6f0f0e0270927f77b6221a043a89
// flow-typed version: b43dff3e0e/file-type_v3.x.x/flow_>=v0.25.x

declare module "file-type" {
  declare module.exports: (
    buffer: Buffer | Uint8Array
  ) => ?{ ext: string, mime: string }
}
