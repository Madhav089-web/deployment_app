import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { ThemeToggle } from "@/components/ThemeToggle";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Fashion Designer",
  description: "Design. Visualize. Wear. Generative AI Fashion Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          {children}
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
