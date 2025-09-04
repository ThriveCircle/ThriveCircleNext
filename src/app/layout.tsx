import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './providers/queryClient';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './providers/theme';
import { RightDrawerProvider } from './providers/RightDrawerProvider';
import React from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThriveCircleNext",
  description: "Thrive Circle full-stack app in Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RightDrawerProvider>
              {children}
            </RightDrawerProvider>
          </ThemeProvider>
          {/* @ts-expect-error react-query-devtools type mismatch with React 19 */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
