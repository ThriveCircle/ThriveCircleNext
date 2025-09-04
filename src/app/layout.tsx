import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './providers/queryClient';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './providers/theme';
import { RightDrawerProvider } from './providers/RightDrawerProvider';
import { AppShell } from './AppShell';
import React from 'react';

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
              <AppShell>
                {children}
              </AppShell>
            </RightDrawerProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
