import { useQuery } from '@tanstack/react-query';
import { weatherService } from './services';

export const weatherKeys = {
  all: ['weather'] as const,
  forecast: () => [...weatherKeys.all, 'forecast'] as const,
  mock: () => [...weatherKeys.all, 'mock'] as const,
  failed: () => [...weatherKeys.all, 'failed'] as const,
};

export const useWeatherForecast = () =>
  useQuery({
    queryKey: weatherKeys.forecast(),
    queryFn: weatherService.getForecast,
  });

export const useMockWeatherForecast = () =>
  useQuery({ queryKey: weatherKeys.mock(), queryFn: weatherService.getMock });

export const useSlowWeatherForecast = (delayMs = 5000) =>
  useQuery({
    queryKey: [...weatherKeys.all, 'slow', delayMs],
    queryFn: () => weatherService.getSlow(delayMs),
  });

export const useFailedWeatherForecast = () =>
  useQuery({
    queryKey: weatherKeys.failed(),
    queryFn: weatherService.getFailed,
    retry: false,
  });
