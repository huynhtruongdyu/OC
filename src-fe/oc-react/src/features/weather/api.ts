import { api } from '@/api';
import type { ApiResponse } from '@/types';
import type { WeatherForecast } from './types';

export const getWeatherForecast = () =>
  api
    .get<ApiResponse<WeatherForecast[]>>(
      '/api/v1/public/WeatherForecast/Current',
    )
    .then((res) => res.data.data!);

export const getMockWeatherForecast = () =>
  api
    .get<ApiResponse<WeatherForecast[]>>('/api/v1/public/WeatherForecast/Mock')
    .then((res) => res.data.data!);

export const getSlowWeatherForecast = (delayMs = 5000) =>
  api
    .get<ApiResponse<WeatherForecast[]>>(
      '/api/v1/public/WeatherForecast/Slow',
      { params: { delayMs } },
    )
    .then((res) => res.data.data!);

export const getFailedWeatherForecast = () =>
  api
    .get<ApiResponse<WeatherForecast[]>>(
      '/api/v1/public/WeatherForecast/Failed',
    )
    .then((res) => {
      if (!res.data.success) throw res.data;
      return res.data.data!;
    });
