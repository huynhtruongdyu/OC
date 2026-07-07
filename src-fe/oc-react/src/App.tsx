import { useWeatherForecast, useMockWeatherForecast, useSlowWeatherForecast, useFailedWeatherForecast } from '@/features';

const Temp = ({ celsius }: { celsius: number }) => (
  <span
    className={
      celsius > 30 ? 'text-red-500' : celsius < 10 ? 'text-blue-500' : ''
    }
  >
    {celsius}°C
  </span>
);

const WeatherTable = ({ title, forecasts }: { title: string; forecasts: { date: string; temperatureC: number; summary: string | null }[] }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <table className="w-full max-w-md border-collapse">
      <thead>
        <tr className="border-b text-left">
          <th className="pr-4">Date</th>
          <th className="pr-4">Temp</th>
          <th>Summary</th>
        </tr>
      </thead>
      <tbody>
        {forecasts.map((f) => (
          <tr key={f.date} className="border-b">
            <td className="pr-4 py-1">{f.date}</td>
            <td className="pr-4 py-1"><Temp celsius={f.temperatureC} /></td>
            <td className="py-1">{f.summary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const App = () => {
  const { data: current, isLoading: loadingCurrent } = useWeatherForecast();
  const { data: mock, isLoading: loadingMock } = useMockWeatherForecast();
  const { data: slow, isLoading: loadingSlow } = useSlowWeatherForecast();
  const { error: failedError, isLoading: loadingFailed } = useFailedWeatherForecast();

  return (
    <div className="content flex gap-8 items-start">
      <div className="flex flex-col gap-8">
        {loadingCurrent && <p>Loading current...</p>}
        {current && <WeatherTable title="Current" forecasts={current} />}
        {loadingMock && <p>Loading mock...</p>}
        {mock && <WeatherTable title="Mock" forecasts={mock} />}
        {loadingSlow && <p className="text-yellow-600">Loading slow (5s delay)...</p>}
        {slow && <WeatherTable title="Slow (5s)" forecasts={slow} />}
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Failed Request</h2>
        {loadingFailed && <p>Loading failed...</p>}
        {failedError && (
          <pre className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm whitespace-pre-wrap">
            {JSON.stringify(failedError, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default App;
