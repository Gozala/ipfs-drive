// @flow

import type { Callback } from "callback.flow"
import type { Source, Through, Sink } from "pull-stream"

declare module "pull-peek" {
  declare export default function peek<x, a>(
    Callback<x, a>
  ): Through<x, x, a, a>
}
