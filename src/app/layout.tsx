import type { Metadata } from 'next';
import './globals.css';
import { BusinessProvider } from '@/components/providers/BusinessContext';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Navbar } from '@/components/navigation/Navbar';

export const metadata: Metadata = {
  title: 'ProcessMind — Small Business AI Process Learning & Automation SaaS',
  description: 'Learns repetitive digital work from screen recordings with Computer Vision, specialized Multi-Agent orchestration, Developer Tools, and drift detection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen antialiased flex">
        <BusinessProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </BusinessProvider>
      </body>
    </html>
  );
}
