import { memo } from 'react';

import { Example } from './example';

const App = memo(() => (
  <main className="bg-background">
    <Example></Example>
  </main>
));

export default App;
