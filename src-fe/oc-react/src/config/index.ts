export const config = {
  app: {
    name: 'OC React',
    version: '1.0.0',
  },
  env: {
    environment: import.meta.env.PUBLIC_ENVIRONMENT ?? 'development',
    apiUrl: import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000',
    enableDebug: import.meta.env.PUBLIC_ENABLE_DEBUG === 'true',
  },
  isDev:
    (import.meta.env.PUBLIC_ENVIRONMENT ?? 'development') === 'development',
  isProd:
    (import.meta.env.PUBLIC_ENVIRONMENT ?? 'development') === 'production',
} as const;

export type Config = typeof config;
