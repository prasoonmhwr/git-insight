import "@/styles/globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Git Insight",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
      <ThemeProvider attribute="class" 
        defaultTheme="dark" 
        forcedTheme="dark"
        enableSystem={false}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster richColors/>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
