import { useSlowWeatherForecast } from '@/features';
import { WeatherTable } from '@/components/weather';
import { Typography, Spin } from 'antd';

const SlowPage = () => {
  const { data, isLoading } = useSlowWeatherForecast();

  return (
    <Spin spinning={isLoading} description="Loading slow (5s delay)...">
      <Typography.Title level={4}>Slow Weather</Typography.Title>
      {data && <WeatherTable data={data} />}
    </Spin>
  );
};

export default SlowPage;
