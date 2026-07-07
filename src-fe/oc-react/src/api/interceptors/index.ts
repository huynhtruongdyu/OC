import type { AxiosInstance } from 'axios';
import { onFulfilled as onAuthTokenFulfilled } from './authToken';
import { onRequest as onRequestTimerFulfilled } from './requestTimer';
import {
  onFulfilled as onRequestLoggerFulfilled,
  onRejected as onRequestLoggerRejected,
} from './requestLogger';
import {
  onFulfilled as onResponseLoggerFulfilled,
  onRejected as onResponseLoggerRejected,
} from './responseLogger';
import { onRejected as onResponseErrorToastRejected } from './responseErrorToast';
import { onRejected as onRefreshTokenRejected } from './refreshToken';

export const registerInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(onAuthTokenFulfilled);
  api.interceptors.request.use(onRequestTimerFulfilled);
  api.interceptors.request.use(
    onRequestLoggerFulfilled,
    onRequestLoggerRejected,
  );
  api.interceptors.response.use(
    onResponseLoggerFulfilled,
    onResponseLoggerRejected,
  );
  api.interceptors.response.use(undefined, onResponseErrorToastRejected);
  api.interceptors.response.use(undefined, onRefreshTokenRejected);
};
