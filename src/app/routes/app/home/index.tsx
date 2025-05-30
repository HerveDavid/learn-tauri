import { Example } from '@/components/layouts/example/example';
import { StateView } from '@/components/layouts/state-view';
import { memo } from 'react';

const App = memo(() => {
  return (
    <StateView>
      <div className="h-full w-full bg-card border border-border rounded-lg overflow-hidden">
        <Example />
      </div>
    </StateView>
  );
});

export default App;