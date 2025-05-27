import { memo } from 'react';

import Table from '@/features/table';

const App = memo(() => (
  <main className="bg-background flex">
    <Table />
  </main>
));

export default App;
