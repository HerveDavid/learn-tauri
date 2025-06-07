import * as Effect from 'effect/Effect';

import { SettingsService } from './types';

export class SettingsClient extends Effect.Service<SettingsClient>()(
  '@/common/SettingsClient',
  {
    dependencies: [],
    effect: Effect.gen(function* () {
      return {
        getSetting: <T>(key: string) =>
          Effect.gen(function* () {
            yield* Effect.logWarning(
              `Not implemented: getSetting for key "${key}"`,
            );

            return undefined as T;
          }),

        setSetting: <T>(key: string, value: T) =>
          Effect.gen(function* () {
            yield* Effect.logWarning(
              `Not implemented: setSetting for key "${key}" with value "${value}"`,
            );

            return undefined as T;
          }),
      } as SettingsService;
    }),
  },
) {}
