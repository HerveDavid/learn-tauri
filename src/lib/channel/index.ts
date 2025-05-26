import { ChannelClient } from "@/services/common/channel-client";
import { useRuntime } from "@/services/runtime/use-runtime";
import { Channel } from "@tauri-apps/api/core";
import { Effect } from "effect";
import { useCallback, useEffect, useState } from "react";

export const useChannel = <T>() => {
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

  return {
    channel,
    setChannel,
    getChannel,
  };
};

export const useChannelHandler = <T>(
  handlerId: string,
  handler: (data: T) => Effect.Effect<void>
) => {
  const runtime = useRuntime();

  useEffect(() => {
    const registerEffect = Effect.gen(function* () {
      const channelService = yield* ChannelClient;
      return yield* channelService.registerHandler(handlerId, handler);
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
};
