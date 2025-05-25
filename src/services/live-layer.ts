import type * as Layer from "effect/Layer";
import type * as ManagedRuntime from "effect/ManagedRuntime";

import { WorkerClient } from "./worker/worker-client";
import { QueryClient } from "./common/query-client";

export type LiveLayerType = Layer.Layer<WorkerClient | QueryClient>;
export type LiveManagedRuntime = ManagedRuntime.ManagedRuntime<
  Layer.Layer.Success<LiveLayerType>,
  never
>;
export type LiveRuntimeContext =
  ManagedRuntime.ManagedRuntime.Context<LiveManagedRuntime>;
