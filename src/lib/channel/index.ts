import { ChannelClient } from "@/services/common/channel-client";
import { useRuntime } from "@/services/runtime/use-runtime";
import { Channel } from "@tauri-apps/api/core";
import { Effect } from "effect";
import { useCallback, useEffect, useState } from "react";

export interface ChannelProps<T> {
  channelId: string;
  handlerId?: string;
  handler?: (data: T) => void;
}

export const useChannel = <T>({
  channelId,
  handlerId,
  handler,
}: ChannelProps<T>) => {
  const runtime = useRuntime();
  const [channel, setChannelState] = useState<Channel<T> | null>(null);

  useEffect(() => {
    const syncChannelEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      const currentChannel = yield* channelClient.getChannel<T>(channelId);
      return currentChannel;
    });

    runtime.runPromise(syncChannelEffect).then(setChannelState);
  }, [runtime, channelId]);

  const setChannel = useCallback(
    (newChannel: Channel<T>) => {
      const effect = Effect.gen(function* () {
        const channelClient = yield* ChannelClient;
        yield* channelClient.setChannel(channelId, newChannel);
      });

      runtime
        .runPromise(effect)
        .then(() => {
          setChannelState(newChannel);
        })
        .catch((error) => {
          console.error(`Failed to set channel ${channelId}:`, error);
        });
    },
    [runtime, channelId]
  );

  const getChannel = useCallback(async (): Promise<Channel<T> | null> => {
    const effect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      return yield* channelClient.getChannel<T>(channelId);
    });

    const result = await runtime.runPromise(effect);
    setChannelState(result);
    return result;
  }, [runtime, channelId]);

  const removeChannel = useCallback(() => {
    const effect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      yield* channelClient.removeChannel(channelId);
    });

    runtime
      .runPromise(effect)
      .then(() => {
        setChannelState(null);
      })
      .catch((error) => {
        console.error(`Failed to remove channel ${channelId}:`, error);
      });
  }, [runtime, channelId]);

  useEffect(() => {
    if (!handlerId || !handler) return;

    const handleEffect = (data: T) =>
      Effect.sync(() => {
        try {
          handler(data);
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

    const unregisterEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      yield* channelClient.unregisterHandler(channelId, handlerId);
    });

    let isRegistered = false;
    runtime
      .runPromise(registerEffect)
      .then(() => {
        isRegistered = true;
      })
      .catch((error) => {
        console.error(
          `Failed to register handler ${handlerId} for channel ${channelId}:`,
          error
        );
      });

    return () => {
      if (isRegistered) {
        runtime.runPromise(unregisterEffect).catch((error) => {
          console.error(
            `Failed to unregister handler ${handlerId} from channel ${channelId}:`,
            error
          );
        });
      }
    };
  }, [channelId, handlerId, handler, runtime]);

  return {
    channel,
    setChannel,
    getChannel,
    removeChannel,
    channelId,
  };
};
