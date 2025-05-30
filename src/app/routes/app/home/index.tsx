import { Example } from '@/components/layouts/example/example';
import { StateView } from '@/components/layouts/state-view';

const App = () => {
  return (
    <StateView>
      <div className="h-full w-full bg-card border border-border overflow-hidden">
        <Example />
      </div>
    </StateView>
  );
};

export default App;
