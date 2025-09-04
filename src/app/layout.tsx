import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from './providers/AppProviders';
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
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
