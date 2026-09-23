import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/aarogya/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aarogya AI — Healthcare Intelligence Platform",
  description: "AI-powered health intelligence for every Indian. From symptom triage to lab analysis, X-ray reading to predictive health — 23 modules, 11 languages, powered by medical-grade AI.",
  keywords: ["Aarogya AI", "Aarogya AI", "healthcare AI", "symptom checker", "lab report analyzer", "X-ray AI", "Ayurveda", "Indian healthcare"],
  authors: [{ name: "Aarogya AI" }],
  openGraph: {
    title: "Aarogya AI — Healthcare Intelligence",
    description: "AI-powered health intelligence platform with 23 medical AI modules",
    siteName: "Aarogya AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
