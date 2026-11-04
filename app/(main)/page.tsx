import { CertificateEditor } from '@/components/home/certificate-editor';

function HomePage() {
  return (
    <div className='mx-auto flex w-full max-w-[1280px] flex-col gap-6 p-4 md:gap-12 md:p-8'>
      <CertificateEditor />
    </div>
  );
}

export default HomePage;
