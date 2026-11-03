import { CertificateEditor } from '@/components/home/certificate-editor';

function HomePage() {
  return (
    <div className='mx-auto flex w-full max-w-[1280px] flex-col gap-6 p-4 md:gap-12 md:p-8'>
      <div>
        <h1 className='text-2xl font-bold lg:text-3xl'>Preview</h1>
        <p className='mt-1 text-muted'>
          A4 landscape · what you see is what you download
        </p>
      </div>
      <CertificateEditor />
    </div>
  );
}

export default HomePage;
