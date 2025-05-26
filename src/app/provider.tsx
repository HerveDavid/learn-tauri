import React from "react";

// Effect imports
import * as Duration from "effect/Duration";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";
import * as ManagedRuntime from "effect/ManagedRuntime";

import {
  QueryClientProvider,
  QueryClient as TanstackQueryClient,
} from "@tanstack/react-query";

// Project layers
import { LiveManagedRuntime } from "@/services/live-layer";
import { WorkerClient } from "@/services/worker/worker-client";
import { RuntimeProvider } from "@/services/runtime/runtime-provider";
import { LogLevel } from "effect";
import { QueryClient } from "@/services/common/query-client";
import { ChannelClient } from "@/services/common/channel-client";

const InnerProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient: TanstackQueryClient = React.useMemo(
    () =>
      new TanstackQueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            retryDelay: 0,
            staleTime: Duration.toMillis("5 minutes"),
          },
          mutations: {
            retry: false,
            retryDelay: 0,
          },
        },
      }),
    []
  );

  const runtime: LiveManagedRuntime = React.useMemo(
    () =>
      ManagedRuntime.make(
        Layer.mergeAll(
          WorkerClient.Default,
          QueryClient.make(queryClient),
          ChannelClient.Default,
          Logger.minimumLogLevel(LogLevel.Debug)
        ).pipe(Layer.provide(Logger.pretty))
      ),
    [queryClient]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RuntimeProvider runtime={runtime}>{children}</RuntimeProvider>
    </QueryClientProvider>
  );
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <InnerProviders>{children}</InnerProviders>;
};
