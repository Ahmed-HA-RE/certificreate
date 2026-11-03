import { Header } from '@/app/(main)/_components/header';

export default function MainLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className='flex min-h-dvh flex-col'>
      <Header />
      <main className='flex-1'>{children}</main>
    </div>
  );
}
