import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Church Offering Counting, Simplified`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Tally cash offerings by denomination, share a read-only summary via an expiring link, and export as CSV. No accounts, no login.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Church Offering Counting, Simplified`,
    description:
      "Tally cash offerings by denomination, share a read-only summary via an expiring link, and export as CSV.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Church Offering Counting, Simplified`,
    description:
      "Tally cash offerings by denomination, share a read-only summary via an expiring link, and export as CSV.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
