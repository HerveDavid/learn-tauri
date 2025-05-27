import { invoke, Channel } from '@tauri-apps/api/core';
import * as Effect from 'effect/Effect';
import * as Ref from 'effect/Ref';

import { ChannelNotFoundError, HandlerAlreadyExistsError } from './error';
import { ChannelData, ChannelService } from './type';

export class ChannelClient extends Effect.Service<ChannelClient>()(
  '@/common/ChannelClient',
  {
    dependencies: [],
    effect: Effect.gen(function* () {
      const channelsRef = yield* Ref.make<Map<string, ChannelData>>(new Map());

      const cleanupChannel = (channelData: ChannelData) => {
        if (channelData.channel) {
          channelData.channel.onmessage = (_) => {};
        }
      };

      const updateHandlerCache = (channelData: ChannelData): void => {
        channelData.handlersArray = Array.from(channelData.handlers.values());
      };

      const createMessageHandler = (channelId: string) => (data: any) => {
        Effect.runFork(
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            const channelData = channels.get(channelId);

            if (!channelData || channelData.handlersArray.length === 0) {
              return;
            }

            const handlersArray = channelData.handlersArray;
            const length = handlersArray.length;

            if (length === 1) {
              yield* handlersArray[0](data).pipe(
                Effect.catchAll((error) =>
                  Effect.logError(
                    `Handler in channel ${channelId} failed: ${error}`,
                  ),
                ),
              );
            } else {
              yield* Effect.forEach(
                handlersArray,
                (handler) =>
                  handler(data).pipe(
                    Effect.catchAll((error) =>
                      Effect.logError(
                        `Handler in channel ${channelId} failed: ${error}`,
                      ),
                    ),
                  ),
                { concurrency: 'unbounded', batching: true },
              );
            }
          }).pipe(
            Effect.catchAll((error) =>
              Effect.logError(
                `Message processing failed for channel ${channelId}: ${error}`,
              ),
            ),
          ),
        );
      };

      const ensureChannel = <T>(channelId: string) =>
        Effect.gen(function* () {
          const channels = yield* Ref.get(channelsRef);
          const existingChannelData = channels.get(channelId);

          if (existingChannelData) {
            return existingChannelData.channel as Channel<T>;
          }

          const newChannel = new Channel<T>();
          const channelData: ChannelData = {
            channel: newChannel as Channel<any>,
            handlers: new Map(),
            handlersArray: [],
          };

          newChannel.onmessage = createMessageHandler(channelId);

          yield* Ref.set(
            channelsRef,
            new Map(channels).set(channelId, channelData),
          );

          yield* Effect.logDebug(`Auto-created channel ${channelId}`);
          return newChannel;
        });

      const cleanupChannelIfEmpty = (channelId: string) =>
        Effect.gen(function* () {
          const channels = yield* Ref.get(channelsRef);
          const channelData = channels.get(channelId);

          if (!channelData || channelData.handlers.size > 0) {
            return;
          }

          cleanupChannel(channelData);

          yield* Effect.tryPromise({
            try: () => invoke('unregister', { id: channelId }),
            catch: (error) =>
              Effect.logError(
                `Backend cleanup failed for channel ${channelId}: ${error}`,
              ),
          });

          const newChannels = new Map(channels);
          newChannels.delete(channelId);
          yield* Ref.set(channelsRef, newChannels);

          yield* Effect.logDebug(`Auto-destroyed empty channel ${channelId}`);
        });

      return {
        registerHandler: <T>(
          channelId: string,
          handlerId: string,
          handler: (data: T) => Effect.Effect<void>,
        ) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            let channelData = channels.get(channelId);

            if (!channelData) {
              yield* ensureChannel<T>(channelId);
              const newChannels = yield* Ref.get(channelsRef);
              channelData = newChannels.get(channelId)!;
            }

            if (channelData.handlers.has(handlerId)) {
              yield* Effect.fail(
                new HandlerAlreadyExistsError(handlerId, channelId),
              );
            }

            const isFirstHandler = channelData.handlers.size === 0;

            if (isFirstHandler) {
              yield* Effect.tryPromise({
                try: () =>
                  invoke('register', {
                    id: channelId,
                    channel: channelData.channel,
                  }),
                catch: (error) =>
                  Effect.logError(
                    `Tauri registration failed for channel ${channelId}: ${error}`,
                  ),
              });
            }

            const newChannels = new Map(yield* Ref.get(channelsRef));
            const newChannelData = { ...newChannels.get(channelId)! };
            newChannelData.handlers = new Map(newChannelData.handlers);
            newChannelData.handlers.set(handlerId, handler as any);

            updateHandlerCache(newChannelData);

            newChannels.set(channelId, newChannelData);
            yield* Ref.set(channelsRef, newChannels);

            yield* Effect.logDebug(
              `Handler ${handlerId} registered for channel ${channelId} (total: ${newChannelData.handlersArray.length})`,
            );
            return handlerId;
          }),

        unregisterHandler: (channelId: string, handlerId: string) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            const channelData = channels.get(channelId);

            if (!channelData) {
              yield* Effect.logWarning(
                `Channel ${channelId} not found for handler unregistration`,
              );
              return;
            }

            if (!channelData.handlers.has(handlerId)) {
              yield* Effect.logWarning(
                `Handler ${handlerId} not found in channel ${channelId}`,
              );
              return;
            }

            const newChannels = new Map(channels);
            const newChannelData = { ...newChannels.get(channelId)! };
            newChannelData.handlers = new Map(newChannelData.handlers);
            newChannelData.handlers.delete(handlerId);

            updateHandlerCache(newChannelData);
            newChannels.set(channelId, newChannelData);
            yield* Ref.set(channelsRef, newChannels);

            yield* Effect.logDebug(
              `Handler ${handlerId} unregistered from channel ${channelId} (remaining: ${newChannelData.handlersArray.length})`,
            );

            yield* cleanupChannelIfEmpty(channelId);
          }),

        getChannel: <T>(channelId: string) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            const channelData = channels.get(channelId);

            if (!channelData) {
              return yield* Effect.fail(new ChannelNotFoundError(channelId));
            }

            return channelData.channel as Channel<T>;
          }),

        hasHandler: (channelId: string, handlerId: string) =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            const channelData = channels.get(channelId);
            return channelData?.handlers.has(handlerId) ?? false;
          }),

        startChannel: (channelId: string) =>
          Effect.gen(function* () {
            return yield* Effect.tryPromise(() =>
              invoke('start', { id: channelId }),
            );
          }),

        pauseChannel: (channelId: string) =>
          Effect.gen(function* () {
            return yield* Effect.tryPromise(() =>
              invoke('pause', { id: channelId }),
            );
          }),

        getChannelIds: () =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);
            return Array.from(channels.keys());
          }),

        cleanup: () =>
          Effect.gen(function* () {
            const channels = yield* Ref.get(channelsRef);

            for (const [channelId, channelData] of channels.entries()) {
              cleanupChannel(channelData);
              yield* Effect.tryPromise({
                try: () => invoke('unregister', { id: channelId }),
                catch: Effect.logError,
              });
            }

            yield* Ref.set(channelsRef, new Map());
            yield* Effect.logDebug('All channels cleaned up');
          }),
      } as ChannelService;
    }),
  },
) {}
