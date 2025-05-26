import { Channel } from "@tauri-apps/api/core";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Ref from "effect/Ref";

export interface ChannelService {
  readonly getChannel: <T>() => Effect.Effect<Channel<T> | null>;
  readonly setChannel: <T>(channel: Channel<T>) => Effect.Effect<void>;
  readonly registerHandler: <T>(
    handlerId: string,
    handler: (data: T) => Effect.Effect<void>
  ) => Effect.Effect<string>;
  readonly unregisterHandler: (handlerId: string) => Effect.Effect<void>;
}

export class ChannelClient extends Effect.Tag("@/common/ChannelService")<
  ChannelService,
  ChannelService
>() {
  public static readonly make = () =>
    Layer.effect(
      this,
      Effect.gen(function* () {
        // State with refs
        const channelRef = yield* Ref.make<Channel<any> | null>(null);
        const handlersRef = yield* Ref.make<
          Map<string, (data: any) => Effect.Effect<void>>
        >(new Map());

        // Implementation of service
        return ChannelClient.of({
          getChannel: <T>() =>
            Effect.gen(function* () {
              const channel = yield* Ref.get(channelRef);
              return channel as Channel<T> | null;
            }),

          setChannel: <T>(channel: Channel<T>) =>
            Effect.gen(function* () {
              channel.onmessage = (data) => {
                Effect.runFork(
                  Effect.gen(function* () {
                    const handlers = yield* Ref.get(handlersRef);
                    yield* Effect.forEach(
                      Array.from(handlers.values()),
                      (handler) => handler(data),
                      { concurrency: "unbounded" }
                    );
                  }).pipe(Effect.catchAll(Effect.logError))
                );
              };

              yield* Ref.set(channelRef, channel);
              yield* Effect.logDebug("Channel registered");
            }),

          registerHandler: <T>(
            handlerId: string,
            handler: (data: T) => Effect.Effect<void>
          ) =>
            Effect.gen(function* () {
              yield* Ref.update(handlersRef, (handlers) =>
                new Map(handlers).set(handlerId, handler)
              );

              yield* Effect.logDebug(`Handler ${handlerId} registered`);
              return handlerId;
            }),

          unregisterHandler: (handlerId: string) =>
            Effect.gen(function* () {
              yield* Ref.update(handlersRef, (handlers) => {
                const newHandlers = new Map(handlers);
                newHandlers.delete(handlerId);
                return newHandlers;
              });

              yield* Effect.logDebug(`Handler ${handlerId} unregistered`);
            }),
        });
      })
    );
}
