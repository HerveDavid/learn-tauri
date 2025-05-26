import { ChannelClient } from "@/services/common/channel-client";
import { useRuntime } from "@/services/runtime/use-runtime";
import { Channel } from "@tauri-apps/api/core";
import { Effect } from "effect";
import { useCallback, useEffect, useState } from "react";

export interface ChannelProps<T> {
  handlerId?: string;
  handler?: (data: T) => void;
}

export const useChannel = <T>({ handlerId, handler }: ChannelProps<T>) => {
  const runtime = useRuntime();
  const [channel, setChannelState] = useState<Channel<T> | null>(null);

  const setChannel = useCallback(
    (newChannel: Channel<T>) => {
      const effect = Effect.gen(function* () {
        const channelClient = yield* ChannelClient;
        yield* channelClient.setChannel(newChannel);
      });

      runtime.runPromise(effect);
      setChannelState(newChannel);
    },
    [runtime]
  );

  const getChannel = useCallback(async (): Promise<Channel<T> | null> => {
    const effect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      return yield* channelClient.getChannel<T>();
    });

    return runtime.runPromise(effect);
  }, [runtime]);

  useEffect(() => {
    if (!handlerId || !handler) return;

    const handleEffect = (data: T) => Effect.sync(() => handler(data));

    const registerEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      return yield* channelClient.registerHandler(handlerId, handleEffect);
    });

    const unregisterEffect = Effect.gen(function* () {
      const channelClient = yield* ChannelClient;
      yield* channelClient.unregisterHandler(handlerId);
    });

    runtime.runPromise(registerEffect);

    return () => {
      runtime.runPromise(unregisterEffect);
    };
  }, [handlerId, handler, runtime]);

  return {
    channel,
    setChannel,
    getChannel,
  };
};
