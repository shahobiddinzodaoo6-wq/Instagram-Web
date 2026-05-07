"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient } from "@tanstack/react-query";
import { Providers } from "./provider";
import { SplashScreen } from "../shared/ui/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



const queryClient = new QueryClient()




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}




