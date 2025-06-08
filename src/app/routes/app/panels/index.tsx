import { useParams } from 'react-router';

import { CentralPanel } from '@/features/central-panel';

const Panels = () => {
  const { id } = useParams();

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <CentralPanel defaultPanels={[{ id: id! }]} />
    </div>
  );
};

export default Panels;
