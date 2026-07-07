import {
  getFailedWeatherForecast,
  getMockWeatherForecast,
  getSlowWeatherForecast,
  getWeatherForecast,
} from './api';

export const weatherService = {
  getForecast: () => getWeatherForecast(),
  getMock: () => getMockWeatherForecast(),
  getSlow: (delayMs = 5000) => getSlowWeatherForecast(delayMs),
  getFailed: () => getFailedWeatherForecast(),
};
