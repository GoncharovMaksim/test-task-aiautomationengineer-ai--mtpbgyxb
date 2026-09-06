import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metacritic AI Pipeline & Analytics",
  description: "Automated hourly Metacritic crawler, AI review summarizer, YouTube let's play commentary analyzer, and real-time monitoring dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased selection:bg-zinc-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
