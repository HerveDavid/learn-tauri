import { ChannelClient } from "@/services/common/channel-client";
import { useRuntime } from "@/services/runtime/use-runtime";
import { Channel } from "@tauri-apps/api/core";
import { Effect } from "effect";
import { useCallback, useEffect, useState } from "react";

export const useChannel = <T>({
  handlerId,
  handler,
}: {
  handlerId?: string;
  handler?: (data: T) => void;
}) => {
  const runtime = useRuntime();
  const [channel, setChannelState] = useState<Channel<T> | null>(null);

  const setChannel = useCallback(
    (newChannel: Channel<T>) => {
      const effect = Effect.gen(function* () {
        const channelService = yield* ChannelClient;
        yield* channelService.setChannel(newChannel);
      });

      runtime.runPromise(effect);
      setChannelState(newChannel);
    },
    [runtime]
  );

  const getChannel = useCallback(async (): Promise<Channel<T> | null> => {
    const effect = Effect.gen(function* () {
      const channelService = yield* ChannelClient;
      return yield* channelService.getChannel<T>();
    });

    return runtime.runPromise(effect);
  }, [runtime]);

  useEffect(() => {
    if (!handlerId || !handler) return;

    const handleEffect = (data: T) => Effect.sync(() => handler(data));

    const registerEffect = Effect.gen(function* () {
      const channelService = yield* ChannelClient;
      return yield* channelService.registerHandler(handlerId, handleEffect);
    });

    const unregisterEffect = Effect.gen(function* () {
      const channelService = yield* ChannelClient;
      yield* channelService.unregisterHandler(handlerId);
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
