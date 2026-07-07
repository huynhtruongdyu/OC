import type { WeatherForecast } from '@/features';
import { Table, Tag } from 'antd';

const TempTag = ({ celsius }: { celsius: number }) => {
  const color = celsius > 30 ? 'red' : celsius < 10 ? 'blue' : 'green';
  return <Tag color={color}>{celsius}°C</Tag>;
};

const columns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  {
    title: 'Temp',
    dataIndex: 'temperatureC',
    key: 'temperatureC',
    render: (v: number) => <TempTag celsius={v} />,
  },
  { title: 'Summary', dataIndex: 'summary', key: 'summary' },
];

export const WeatherTable = ({ data }: { data: WeatherForecast[] }) => (
  <Table
    dataSource={data}
    columns={columns}
    rowKey="date"
    pagination={false}
    size="small"
  />
);
