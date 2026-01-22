import type { Metadata } from "next";
import { Geist_Mono, Inter, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elia Hilse",
  description: "Principal Software Engineer & Tech Lover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                })();
              `,
            }}
          />
        </head>
        <body
          className={`${inter.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${geistMono.variable} font-sans antialiased`}
        >
          {children}
          <ThemeToggle />
        </body>
      </html>
    </ViewTransitions>
  );
}
