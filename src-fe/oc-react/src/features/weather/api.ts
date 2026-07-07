import { api } from '@/api';
import type { WeatherForecast } from './types';

export const getWeatherForecast = () =>
  api
    .get<WeatherForecast[]>('/api/v1/public/weatherForecast/current')
    .then((res) => res.data);
