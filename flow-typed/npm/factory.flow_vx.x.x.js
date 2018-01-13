// @flow

declare module "factory.flow" {
  declare export type Factory<
    instance,
    constructor = () => void,
    statics = {}
  > = Class<instance> & constructor & statics
}
