import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StreamFlow — IPTV Player',
  description: 'Your personal IPTV streaming app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
