import { Channel } from '@tauri-apps/api/core';
import * as Effect from 'effect/Effect';

import {
  ChannelNotFoundError,
  HandlerAlreadyExistsError,
  RegistrationError,
} from './error';

export interface ChannelService {
  readonly registerHandler: <T>(
    channelId: string,
    handlerId: string,
    handler: (data: T) => Effect.Effect<void>,
  ) => Effect.Effect<string, HandlerAlreadyExistsError | RegistrationError>;

  readonly unregisterHandler: (
    channelId: string,
    handlerId: string,
  ) => Effect.Effect<void>;

  readonly getChannel: <T>(
    channelId: string,
  ) => Effect.Effect<Channel<T> | ChannelNotFoundError>;

  readonly startChannel: (channelId: string) => Effect.Effect<void>;

  readonly pauseChannel: (channelId: string) => Effect.Effect<void>;

  readonly hasHandler: (
    channelId: string,
    handlerId: string,
  ) => Effect.Effect<boolean>;

  readonly getChannelIds: () => Effect.Effect<string[]>;

  readonly cleanup: () => Effect.Effect<void>;
}

export interface ChannelData {
  channel: Channel<any>;
  handlers: Map<string, (data: any) => Effect.Effect<void>>;
  handlersArray: Array<(data: any) => Effect.Effect<void>>;
}
