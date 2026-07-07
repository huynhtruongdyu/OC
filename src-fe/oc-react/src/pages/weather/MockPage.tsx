import { useMockWeatherForecast } from '@/features';
import { WeatherTable } from '@/components/weather';
import { Typography, Spin } from 'antd';

const MockPage = () => {
  const { data, isLoading } = useMockWeatherForecast();

  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4}>Mock Weather</Typography.Title>
      {data && <WeatherTable data={data} />}
    </Spin>
  );
};

export default MockPage;
