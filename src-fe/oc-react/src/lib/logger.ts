import { config } from '@/config';

const noop = (..._args: unknown[]) => {
  void _args;
};

export const logger = config.env.enableDebug
  ? {
      debug: console.debug.bind(console, '[DEBUG]'),
      info: console.info.bind(console, '[INFO]'),
      warn: console.warn.bind(console, '[WARN]'),
      error: console.error.bind(console, '[ERROR]'),
      table: console.table.bind(console),
    }
  : {
      debug: noop,
      info: noop,
      warn: noop,
      error: noop,
      table: noop,
    };
