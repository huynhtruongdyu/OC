import { useWeatherForecast } from '@/features';
import { WeatherTable } from '@/components/weather';
import { Typography, Spin } from 'antd';

const CurrentPage = () => {
  const { data, isLoading } = useWeatherForecast();

  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4}>Current Weather</Typography.Title>
      {data && <WeatherTable data={data} />}
    </Spin>
  );
};

export default CurrentPage;
