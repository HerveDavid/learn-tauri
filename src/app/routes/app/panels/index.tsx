import { Sld } from '@/features/single-line-diagram';
import { useParams } from 'react-router';

const Panels = () => {
  const { id } = useParams();

  return (
    <div className="">
      <Sld id={id!} />
    </div>
  );
};

export default Panels;
