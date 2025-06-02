import { StateView } from '@/components/layouts/state-view';
import { Dashboard } from '@/features/dashboard-panel';

const App = () => {
  return (
    <StateView>
      <Dashboard />
    </StateView>
  );
};

export default App;
