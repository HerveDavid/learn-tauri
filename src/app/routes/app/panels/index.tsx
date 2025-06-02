import { Dashboard } from '@/features/dashboard';
import { useParams } from 'react-router';

const Panels = () => {
  const { id } = useParams();

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <Dashboard defaultPanels={[{ id: id! }]} />
    </div>
  );
};

export default Panels;
