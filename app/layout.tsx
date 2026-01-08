import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "9ja Markets - Political Prediction Platform",
    template: "%s | 9ja Markets"
  },
  description: "Express your opinions on Nigerian political outcomes. Trade prediction markets, track your portfolio, and compete on the leaderboard.",
  keywords: ["political predictions", "prediction markets", "Nigeria", "9ja", "trading", "politics", "forecasting", "opinion markets"],
  authors: [{ name: "9ja Markets" }],
  creator: "9ja Markets",
  publisher: "9ja Markets",
  metadataBase: new URL('https://9jamarkets.com'),
  applicationName: "9ja Markets",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://9jamarkets.com",
    siteName: "9ja Markets",
    title: "9ja Markets - Political Prediction Platform",
    description: "Express your opinions on Nigerian political outcomes and compete with others",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "9ja Markets - Political Prediction Platform",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "9ja Markets - Political Prediction Platform",
    description: "Express your opinions on Nigerian political outcomes",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://9jamarkets.com',
  },
  category: 'politics',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
