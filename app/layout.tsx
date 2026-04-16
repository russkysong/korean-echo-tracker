import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Korea Echo Tracker',
  description: 'Forensic truth-dashboard — global script → Korean mirror',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: { fontFamily: 'ui-monospace, monospace' },
          }}
        />
      </body>
    </html>
  );
}
