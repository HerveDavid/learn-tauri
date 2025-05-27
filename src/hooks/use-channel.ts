import { Channel } from '@tauri-apps/api/core';
import { Effect } from 'effect';
import { useCallback, useEffect, useState, useRef } from 'react';

import { ChannelClient } from '@/services/common/channel-client';
import { useRuntime } from '@/services/runtime/use-runtime';

export interface ChannelProps<T> {
  channelId: string;
  handlerId?: string;
  handler?: (data: T) => void;
  autoConnect?: boolean;
}

export const useChannel = <T>({
  channelId,
  handlerId,
  handler,
  autoConnect = false,
}: ChannelProps<T>) => {
  const runtime = useRuntime();
  const [channel, setChannelState] = useState<Channel<T> | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const syncChannel = useCallback(() => {
    const syncChannelEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      const currentChannel = yield* channelClient.getChannel<T>(channelId);
      return currentChannel;
    });
    runtime.runPromise(syncChannelEffect).then(setChannelState);
  }, [runtime, channelId]);

  const connect = useCallback(async () => {
    if (!handlerId || !handlerRef.current || isConnected) return;

    const handleEffect = (data: T) =>
      Effect.sync(() => handlerRef.current?.(data)).pipe(
        Effect.catchAll((error) =>
          Effect.logError(
            `Error in handler ${handlerId} for channel ${channelId}:`,
            error,
          ),
        ),
      );

    const registerEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      return yield* channelClient.registerHandler(
        channelId,
        handlerId,
        handleEffect,
      );
    });

    await runtime.runPromise(
      registerEffect.pipe(
        Effect.tap(() => {
          setIsConnected(true);
          syncChannel();
        }),
        Effect.tap(() => {
          Effect.log(
            `Connected to channel ${channelId} with handler ${handlerId}`,
          );
        }),
        Effect.catchAll((error) =>
          Effect.logError(
            `Failed to register handler ${handlerId} for channel ${channelId}:`,
            error,
          ),
        ),
      ),
    );
  }, [channelId, handlerId, runtime, syncChannel, isConnected]);

  const disconnect = useCallback(async () => {
    if (!handlerId || !isConnected) return;

    const unregisterEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      yield* channelClient.unregisterHandler(channelId, handlerId);
    });

    await runtime.runPromise(
      unregisterEffect.pipe(
        Effect.tap(() => {
          setIsConnected(false);
          syncChannel();
        }),
        Effect.tap(() =>
          Effect.log(
            `Disconnected from channel ${channelId} handler ${handlerId}`,
          ),
        ),
        Effect.catchAll((error) =>
          Effect.logError(
            `Failed to unregister handler ${handlerId} from channel ${channelId}:`,
            error,
          ),
        ),
      ),
    );
  }, [channelId, handlerId, runtime, syncChannel, isConnected]);

  const start = useCallback(async () => {
    if (!channelId || isStarted) return;

    const startEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      return yield* channelClient.startChannel(channelId);
    });

    await runtime.runPromise(
      startEffect.pipe(
        Effect.tap(() => {
          setIsStarted(true);
          syncChannel();
        }),
        Effect.tap(() => {
          Effect.log(`Started to channel ${channelId}`);
        }),
        Effect.catchAll((error) =>
          Effect.logError(`Failed to start channel ${channelId}:`, error),
        ),
      ),
    );
  }, [channelId, runtime, syncChannel, isStarted]);

  const pause = useCallback(async () => {
    if (!channelId || !isStarted) return;

    const pauseChannel = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      return yield* channelClient.pauseChannel(channelId);
    });

    await runtime.runPromise(
      pauseChannel.pipe(
        Effect.tap(() => {
          setIsStarted(false);
          syncChannel();
        }),
        Effect.tap(() => {
          Effect.log(`Pause to channel ${channelId}`);
        }),
        Effect.catchAll((error) =>
          Effect.logError(`Failed to pause channel ${channelId}:`, error),
        ),
      ),
    );
  }, [channelId, runtime, syncChannel, isStarted]);

  useEffect(() => {
    if (autoConnect && handlerId && handler && !isConnected) {
      connect();
    }

    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [autoConnect, handlerId, handler, isConnected, connect, disconnect]);

  const getChannel = useCallback(async (): Promise<Channel<T> | null> => {
    const effect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      return yield* channelClient.getChannel<T>(channelId);
    });
    const result = await runtime.runPromise(effect);
    setChannelState(result);
    return result;
  }, [runtime, channelId]);

  return {
    channel,
    getChannel,
    channelId,
    isConnected,
    connect,
    disconnect,
    isStarted,
    start,
    pause,
  };
};
