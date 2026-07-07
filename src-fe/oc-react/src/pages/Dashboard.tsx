import {
  useWeatherForecast,
  useMockWeatherForecast,
  useSlowWeatherForecast,
  useFailedWeatherForecast,
} from '@/features';
import { WeatherTable } from '@/components/weather';
import { Typography, Alert, Spin } from 'antd';

const Dashboard = () => {
  const { data: current, isLoading: loadingCurrent } = useWeatherForecast();
  const { data: mock, isLoading: loadingMock } = useMockWeatherForecast();
  const { data: slow, isLoading: loadingSlow } = useSlowWeatherForecast();
  const { error: failedError, isLoading: loadingFailed } =
    useFailedWeatherForecast();

  return (
    <div className="flex flex-col gap-6">
      <Typography.Title level={3}>Weather Dashboard</Typography.Title>

      <Spin spinning={loadingCurrent}>
        {current && (
          <div>
            <Typography.Title level={5}>Current</Typography.Title>
            <WeatherTable data={current} />
          </div>
        )}
      </Spin>

      <Spin spinning={loadingMock}>
        {mock && (
          <div>
            <Typography.Title level={5}>Mock</Typography.Title>
            <WeatherTable data={mock} />
          </div>
        )}
      </Spin>

      <Spin spinning={loadingSlow} description="Loading slow (5s delay)...">
        {slow && (
          <div>
            <Typography.Title level={5}>Slow (5s)</Typography.Title>
            <WeatherTable data={slow} />
          </div>
        )}
      </Spin>

      <Spin spinning={loadingFailed}>
        {failedError && (
          <Alert
            type="error"
            showIcon
            title="Failed Request"
            description={
              <pre className="whitespace-pre-wrap mb-0">
                {JSON.stringify(failedError, null, 2)}
              </pre>
            }
          />
        )}
      </Spin>
    </div>
  );
};

export default Dashboard;
