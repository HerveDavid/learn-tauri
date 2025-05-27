import { memo } from 'react';

import Table from '@/features/table';
import Chart from '@/features/chart';

const App = memo(() => (
  <main className="bg-background flex">
    <div className="flex-1">
      <Table />
    </div>
    <div className="flex-1">
      <Chart />
    </div>
  </main>
));

export default App;
