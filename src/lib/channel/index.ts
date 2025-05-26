import { ChannelClient } from "@/services/common/channel-client";
import { useRuntime } from "@/services/runtime/use-runtime";
import { Channel } from "@tauri-apps/api/core";
import { Effect } from "effect";
import { useCallback, useEffect, useState, useRef } from "react";

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
      Effect.sync(() => {
        try {
          handlerRef.current?.(data);
        } catch (error) {
          console.error(
            `Error in handler ${handlerId} for channel ${channelId}:`,
            error
          );
        }
      });

    const registerEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      return yield* channelClient.registerHandler(
        channelId,
        handlerId,
        handleEffect
      );
    });

    try {
      await runtime.runPromise(registerEffect);
      setIsConnected(true);
      syncChannel();
      console.log(
        `Connected to channel ${channelId} with handler ${handlerId}`
      );
    } catch (error) {
      console.error(
        `Failed to register handler ${handlerId} for channel ${channelId}:`,
        error
      );
    }
  }, [channelId, handlerId, runtime, syncChannel, isConnected]);

  const disconnect = useCallback(async () => {
    if (!handlerId || !isConnected) return;

    const unregisterEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      yield* channelClient.unregisterHandler(channelId, handlerId);
    });

    try {
      await runtime.runPromise(unregisterEffect);
      setIsConnected(false);
      syncChannel();
      console.log(
        `Disconnected from channel ${channelId} handler ${handlerId}`
      );
    } catch (error) {
      console.error(
        `Failed to unregister handler ${handlerId} from channel ${channelId}:`,
        error
      );
    }
  }, [channelId, handlerId, runtime, syncChannel, isConnected]);

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
  };
};
