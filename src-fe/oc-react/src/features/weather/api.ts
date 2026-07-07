import { api } from '@/api';
import type { WeatherForecast } from './types';

export const getWeatherForecast = () =>
  api.get<WeatherForecast[]>('/api/v1/public/WeatherForecast/Current').then((res) => res.data);

export const getMockWeatherForecast = () =>
  api.get<WeatherForecast[]>('/api/v1/public/WeatherForecast/Mock').then((res) => res.data);
