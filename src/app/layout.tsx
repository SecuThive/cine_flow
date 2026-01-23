import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CineScout | Premium Movie Discovery",
  description: "Discover cinematic gems, trending releases, and curated picks powered by TMDB.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "CineScout",
    description: "Immerse yourself in a premium streaming discovery experience.",
    siteName: "CineScout",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-neutral-950 text-neutral-50`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
