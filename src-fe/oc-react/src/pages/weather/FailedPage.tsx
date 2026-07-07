import { useFailedWeatherForecast } from '@/features';
import { Typography, Spin, Alert } from 'antd';

const FailedPage = () => {
  const { error, isLoading } = useFailedWeatherForecast();

  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4}>Failed Request</Typography.Title>
      {error && (
        <Alert
          type="error"
          showIcon
          title="Failed Request"
          description={
            <pre className="whitespace-pre-wrap mb-0">
              {JSON.stringify(error, null, 2)}
            </pre>
          }
        />
      )}
    </Spin>
  );
};

export default FailedPage;
