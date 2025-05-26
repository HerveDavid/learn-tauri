import { invoke, Channel } from "@tauri-apps/api/core";
import * as Effect from "effect/Effect";
import * as Ref from "effect/Ref";

export interface ChannelService {
  readonly getChannel: <T>(
    channelId: string
  ) => Effect.Effect<Channel<T> | null>;
  readonly setChannel: <T>(
    channelId: string,
    channel: Channel<T>
  ) => Effect.Effect<void>;
  readonly removeChannel: (channelId: string) => Effect.Effect<void>;
  readonly registerHandler: <T>(
    channelId: string,
    handlerId: string,
    handler: (data: T) => Effect.Effect<void>
  ) => Effect.Effect<string>;
  readonly unregisterHandler: (
    channelId: string,
    handlerId: string
  ) => Effect.Effect<void>;
  readonly cleanup: () => Effect.Effect<void>;
  readonly hasChannel: (channelId: string) => Effect.Effect<boolean>;
  readonly hasHandler: (
    channelId: string,
    handlerId: string
  ) => Effect.Effect<boolean>;
  readonly getChannelIds: () => Effect.Effect<string[]>;
}

interface ChannelData {
  channel: Channel<any> | null;
  handlers: Map<string, (data: any) => Effect.Effect<void>>;
  handlerArray: Array<(data: any) => Effect.Effect<void>>;
}

export class ChannelAlreadyExistsError extends Error {
  constructor(channelId: string) {
    super(`Channel with id '${channelId}' already exists`);
    this.name = "ChannelAlreadyExistsError";
  }
}

export class ChannelNotFoundError extends Error {
  constructor(channelId: string) {
    super(`Channel with id '${channelId}' not found`);
    this.name = "ChannelNotFoundError";
  }
}

export class HandlerAlreadyExistsError extends Error {
  constructor(channelId: string, handlerId: string) {
    super(`Handler '${handlerId}' already exists for channel '${channelId}'`);
    this.name = "HandlerAlreadyExistsError";
  }
}

export class ChannelClient extends Effect.Service<ChannelClient>()(
  "@/common/ChannelClient",
  {
    dependencies: [],
    effect: Effect.gen(function* () {
      // Map: channelId -> ChannelData
      const channelsRef = yield* Ref.make<Map<string, ChannelData>>(new Map());

      const cleanupChannel = (channelData: ChannelData) => {
        if (channelData.channel) {
          channelData.channel.onmessage = (_) => {};
        }
      };

      const updateHandlerCache = (channelData: ChannelData): void => {
        channelData.handlerArray = Array.from(channelData.handlers.values());
      };

      const createOptimizedMessageHandler =
        (channelId: string) => (data: any) => {
          Effect.runFork(
            Effect.gen(function* () {
              const channels = yield* Ref.get(channelsRef);
              const channelData = channels.get(channelId);

              if (
                !channelData ||
                !channelData.channel ||
                channelData.handlerArray.length === 0
              ) {
                return;
              }

              const handlerArray = channelData.handlerArray;
              const length = handlerArray.length;

              if (length === 1) {
                yield* handlerArray[0](data).pipe(
                  Effect.catchAll((error) =>
                    Effect.logError(
                      `Single handler in channel ${channelId} failed: ${error}`
                    )
                  )
                );
              } else {
                yield* Effect.forEach(
                  handlerArray,
                  (handler) =>
                    handler(data).pipe(
                      Effect.catchAll((error) =>
                        Effect.logError(
                          `Handler in channel ${channelId} failed: ${error}`
                        )
                      )
                    ),
                  { concurrency: "unbounded", batching: true }
                );
              }
            }).pipe(
              Effect.catchAll((error) =>
                Effect.logError(
                  `Message processing failed for channel ${channelId}: ${error}`
                )
              )
            )
          );
        };

      return {
        getChannel: <T>(channelId: string) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            const channelData = channels.get(channelId);
            return channelData?.channel as Channel<T> | null;
          }),

        setChannel: <T>(channelId: string, channel: Channel<T>) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            const existingChannelData = channels.get(channelId);

            let channelData: ChannelData;

            if (existingChannelData) {
              yield* Effect.logDebug(`Updating existing channel ${channelId}`);
              cleanupChannel(existingChannelData);

              channelData = {
                channel: channel as Channel<any>,
                handlers: existingChannelData.handlers,
                handlerArray: existingChannelData.handlerArray,
              };
            } else {
              channelData = {
                channel: channel as Channel<any>,
                handlers: new Map(),
                handlerArray: [],
              };
            }

            channel.onmessage = createOptimizedMessageHandler(channelId);

            yield* Ref.set(
              channelsRef,
              new Map(channels).set(channelId, channelData)
            );
            yield* Effect.logDebug(
              `Channel ${channelId} ${
                existingChannelData ? "updated" : "registered"
              } with ${channelData.handlerArray.length} handlers`
            );
          }),

        removeChannel: (channelId: string) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            const channelData = channels.get(channelId);

            if (!channelData) {
              yield* Effect.fail(new ChannelNotFoundError(channelId));
            }

            cleanupChannel(channelData!);

            const newChannels = new Map(channels);
            newChannels.delete(channelId);
            yield* Ref.set(channelsRef, newChannels);

            yield* Effect.logDebug(`Channel ${channelId} removed`);
          }),

        registerHandler: <T>(
          channelId: string,
          handlerId: string,
          handler: (data: T) => Effect.Effect<void>
        ) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            let channelData = channels.get(channelId);

            if (!channelData) {
              channelData = {
                channel: null as any,
                handlers: new Map(),
                handlerArray: [],
              };
            }

            if (channelData.handlers.has(handlerId)) {
              yield* Effect.fail(
                new HandlerAlreadyExistsError(channelId, handlerId)
              );
            }

            if (channelData.channel) {
              yield* Effect.tryPromise({
                try: () =>
                  invoke("register", {
                    id: channelId,
                    channel: channelData.channel,
                  }),
                catch: Effect.logError,
              });
            }

            const newChannels = new Map(channels);
            const newChannelData = { ...channelData };
            newChannelData.handlers = new Map(newChannelData.handlers);
            newChannelData.handlers.set(handlerId, handler as any);

            updateHandlerCache(newChannelData);

            newChannels.set(channelId, newChannelData);
            yield* Ref.set(channelsRef, newChannels);

            yield* Effect.logDebug(
              `Handler ${handlerId} registered for channel ${channelId} (total: ${newChannelData.handlerArray.length})`
            );
            return handlerId;
          }),

        unregisterHandler: (channelId: string, handlerId: string) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            const channelData = channels.get(channelId);

            if (!channelData) {
              yield* Effect.logWarning(
                `Channel ${channelId} not found for handler unregistration`
              );
              return;
            }

            if (!channelData.handlers.has(handlerId)) {
              yield* Effect.logWarning(
                `Handler ${handlerId} not found in channel ${channelId}`
              );
              return;
            }

            if (channelData.channel) {
              yield* Effect.tryPromise({
                try: () =>
                  invoke("unregister", {
                    id: channelId,
                  }),
                catch: Effect.logError,
              });
            }

            const newChannels = new Map(channels);
            const newChannelData = { ...newChannels.get(channelId)! };
            newChannelData.handlers = new Map(newChannelData.handlers);
            newChannelData.handlers.delete(handlerId);

            updateHandlerCache(newChannelData);

            newChannels.set(channelId, newChannelData);
            yield* Ref.set(channelsRef, newChannels);

            yield* Effect.logDebug(
              `Handler ${handlerId} unregistered from channel ${channelId} (remaining: ${newChannelData.handlerArray.length})`
            );
          }),

        hasChannel: (channelId: string) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            return channels.has(channelId);
          }),

        hasHandler: (channelId: string, handlerId: string) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            const channelData = channels.get(channelId);
            return channelData?.handlers.has(handlerId) ?? false;
          }),

        getChannelIds: () =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            return Array.from(channels.keys());
          }),

        cleanup: () =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);

            for (const channelData of channels.values()) {
              cleanupChannel(channelData);
            }

            yield* Ref.set(channelsRef, new Map());
            yield* Effect.logDebug("All channels cleaned up");
          }),
      } as ChannelService;
    }),
  }
) {}
