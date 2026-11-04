import type { Metadata } from 'next';
import {
  Inter,
  Pinyon_Script,
  Playfair_Display,
  Poppins,
} from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
  weight: ['600', '700'],
});

const pinyonScript = Pinyon_Script({
  variable: '--font-pinyon-script',
  subsets: ['latin'],
  weight: '400',
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Certificreate',
  description:
    'Turn a name, course, and date into a polished course-completion certificate.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={`dark scheme-dark ${inter.variable} ${playfairDisplay.variable} ${pinyonScript.variable} ${poppins.variable}`}
    >
      <body className='bg-background font-sans text-sm text-foreground antialiased'>
        {children}
      </body>
    </html>
  );
}
