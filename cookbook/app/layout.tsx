import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Cookbook',
  description: 'A personal collection of recipes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
