import { Effect } from 'effect';
import { useCallback } from 'react';

import {
  SettingNotFoundError,
  SettingsClient,
  SettingUpdateError,
} from '@/services/common/settings-client';
import { useRuntime } from '@/services/runtime/use-runtime';

export interface SettingsProps<T> {}

export const useSettings = <T>({}: SettingsProps<T>) => {
  const runtime = useRuntime();

  const getSetting = useCallback(
    async (key: string): Promise<T | SettingNotFoundError> => {
      const getEffect = Effect.gen(function* () {
        const settingsClient = yield* SettingsClient;
        return yield* settingsClient.getSetting<T>(key);
      });

      return await runtime.runPromise(getEffect);
    },
    [runtime],
  );

  const setSetting = useCallback(
    async (key: string, value: T): Promise<void | SettingUpdateError> => {
      const setEffect = Effect.gen(function* () {
        const settingsClient = yield* SettingsClient;
        yield* settingsClient.setSetting<T>(key, value);
      });

      return await runtime.runPromise(setEffect);
    },
    [runtime],
  );

  return {
    getSetting,
    setSetting,
  };
};
