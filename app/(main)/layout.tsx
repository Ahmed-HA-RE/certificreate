import { Header } from '@/app/(main)/_components/header';
import { Toaster } from '@/components/ui/sonner';

export default function MainLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className='flex min-h-dvh flex-col'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Toaster position='bottom-right' />
    </div>
  );
}
