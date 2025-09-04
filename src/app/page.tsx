"use client";
import React from 'react';
import { AppShell } from './AppShell';
import Dashboard from './sections/Dashboard';

export default function Home() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}
