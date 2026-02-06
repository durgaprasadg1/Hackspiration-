import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Split-It | Algorand Expense Splitter",
  description: "Decentralized campus expense splitter on Algorand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
