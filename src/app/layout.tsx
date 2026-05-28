import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CampusIQ | Discover & Compare Your Ideal College",
  description: "Search, discover, filter, and compare top universities. Compare tuition rates, rankings, academic profiles, and read verified reviews on CampusIQ.",
  keywords: ["college search", "compare universities", "tuition fees", "college rankings", "admissions rate"],
  openGraph: {
    title: "CampusIQ | Discover & Compare Your Ideal College",
    description: "Search, discover, filter, and compare top universities.",
    type: "website",
    locale: "en_US",
  }
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster theme="light" position="bottom-right" />
      </body>
    </html>
  );
}
