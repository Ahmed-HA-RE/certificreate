import { Certificate } from '@/components/home/certificate';
import { PLACEHOLDER_CERTIFICATE } from '@/lib/certificate';
import type { CertificateData } from '@/types/certificate';

interface ShowcaseSheet {
  label: string;
  note: string;
  data: CertificateData;
}

const SHOWCASE: ShowcaseSheet[] = [
  { label: 'Blue border', note: 'default', data: PLACEHOLDER_CERTIFICATE },
  {
    label: 'Gold border',
    note: 'premium courses',
    data: { ...PLACEHOLDER_CERTIFICATE, border: 'gold' },
  },
];

function HomePage() {
  return (
    <div className='flex flex-col gap-8 overflow-x-auto p-8'>
      {SHOWCASE.map(({ label, note, data }) => (
        <section key={data.border} className='mx-auto'>
          <h2 className='mb-3 flex items-baseline gap-3'>
            <span className='font-semibold'>{label}</span>
            <span className='text-muted'>{note}</span>
          </h2>
          <Certificate data={data} />
        </section>
      ))}
    </div>
  );
}

export default HomePage;
