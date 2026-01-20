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
    default: "FOREKAST - Professional Prediction Markets",
    template: "%s | FOREKAST"
  },
  description: "Express your opinions on global events and market outcomes. Trade prediction markets, track your portfolio, and compete on the leaderboard with FOREKAST.",
  keywords: ["FOREKAST", "prediction markets", "trading", "forecasting", "opinion markets", "sentiment analysis"],
  authors: [{ name: "FOREKAST" }],
  creator: "FOREKAST",
  publisher: "FOREKAST",
  metadataBase: new URL('https://forekast.io'),
  applicationName: "FOREKAST",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/mobile-logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/mobile-logo.png', type: 'image/png' },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://forekast.io",
    siteName: "FOREKAST",
    title: "FOREKAST - Professional Prediction Markets",
    description: "Express your opinions on global events and market outcomes",
    images: [
      {
        url: "/mobile-logo.png",
        width: 512,
        height: 512,
        alt: "FOREKAST Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FOREKAST - Professional Prediction Markets",
    description: "Express your opinions on global events and market outcomes",
    images: ["/mobile-logo.png"],
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
    canonical: 'https://forekast.io',
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
