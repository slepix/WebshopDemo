import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/navbar';
import { ApiClientProvider } from '@/contexts/ApiClientContext';
import { getApiConfig } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Demo Webshop | Modern Fashion Store',
  description: 'Discover the latest fashion trends at My Demo Webshop',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getApiConfig()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ApiClientProvider initialConfig={config}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="min-h-screen bg-background">{children}</main>
            <Toaster />
          </ThemeProvider>
        </ApiClientProvider>
      </body>
    </html>
  );
}
