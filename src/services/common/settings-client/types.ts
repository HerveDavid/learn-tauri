import * as Effect from 'effect/Effect';

import { SettingNotFoundError, SettingUpdateError } from './errors';

export interface SettingsService {
  readonly getSetting: <T>(
    key: string,
  ) => Effect.Effect<T, SettingNotFoundError>;
  readonly setSetting: <T>(
    key: string,
    value: T,
  ) => Effect.Effect<void, SettingUpdateError>;
}
