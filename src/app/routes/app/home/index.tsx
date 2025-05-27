import { memo } from 'react';

import Table from '@/features/table';

const App = memo(() => (
  <main>
    <div className="bg-background">
      <Table />
    </div>
  </main>
));

export default App;
