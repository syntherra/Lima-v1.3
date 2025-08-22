import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/providers/auth-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { RealtimeProvider } from '@/components/providers/realtime-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });

export const metadata: Metadata = {
  title: "Lima - AI Growth Operating System",
  description: "Scale your B2B outreach and relationship management with AI-powered automation",
  keywords: ["AI", "sales", "outreach", "CRM", "email automation", "B2B"],
  authors: [{ name: "Lima Team" }],
  creator: "Lima",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lima.ai",
    title: "Lima - AI Growth Operating System",
    description: "Scale your B2B outreach and relationship management with AI-powered automation",
    siteName: "Lima",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lima - AI Growth Operating System",
    description: "Scale your B2B outreach and relationship management with AI-powered automation",
    creator: "@lima_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-theme="light">
      <body
        className="font-sans antialiased h-full lima-body"
      >
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <RealtimeProvider>
                {children}
              </RealtimeProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
