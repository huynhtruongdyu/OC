import { useWeatherForecast } from '@/features';

const Temp = ({ celsius }: { celsius: number }) => (
  <span
    className={
      celsius > 30 ? 'text-red-500' : celsius < 10 ? 'text-blue-500' : ''
    }
  >
    {celsius}°C
  </span>
);

const App = () => {
  const { data: forecasts, isLoading } = useWeatherForecast();

  return (
    <div className="content">
      {isLoading && <p>Loading weather...</p>}
      {forecasts && (
        <table className="mt-4 w-full max-w-md border-collapse">
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
                <td className="pr-4 py-1">
                  <Temp celsius={f.temperatureC} />
                </td>
                <td className="py-1">{f.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
