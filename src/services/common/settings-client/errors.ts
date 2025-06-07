export class SettingNotFoundError extends Error {
  readonly _tag = 'SettingNotFoundError';
  constructor(key: string) {
    super(`Setting '${key}' not found`);
  }
}

export class SettingAlreadyExistsError extends Error {
  readonly _tag = 'SettingAlreadyExistsError';
  constructor(key: string) {
    super(`Setting '${key}' already exists`);
  }
}

export class SettingUpdateError extends Error {
  readonly _tag = 'SettingUpdateError';
  constructor(key: string, cause: unknown) {
    super(`Failed to update setting '${key}': ${cause}`);
  }
}

export class SettingDeleteError extends Error {
  readonly _tag = 'SettingDeleteError';
  constructor(key: string, cause: unknown) {
    super(`Failed to delete setting '${key}': ${cause}`);
  }
}

export class SettingsInitializationError extends Error {
  readonly _tag = 'SettingsInitializationError';
  constructor(cause: unknown) {
    super(`Failed to initialize settings: ${cause}`);
  }
}
