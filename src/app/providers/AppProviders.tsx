"use client";
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { queryClient } from './queryClient';
import { theme } from './theme';
import { RightDrawerProvider } from '../providers/RightDrawerProvider';
import { AppShell } from '../AppShell';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
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
  );
}


