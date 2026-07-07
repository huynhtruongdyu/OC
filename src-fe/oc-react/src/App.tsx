import { config } from '@/config';

const App = () => {
  return (
    <div className="content">
      <h1>{config.app.name}</h1>
    </div>
  );
};

export default App;

