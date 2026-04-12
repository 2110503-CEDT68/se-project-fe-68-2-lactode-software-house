import './globals.css'
import type { Metadata } from 'next';
import Navbar from '@/src/components/common/Navbar';
import { AppProvider } from '@/src/context/AppContext';

export const metadata: Metadata = {
  title: 'LACTODE SOFEWARE HOUSE | Hotel Booking',
  description: 'Frontend for a hotel booking project built with Next.js and Tailwind CSS.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
