import type { Metadata } from "next";
import { connectToMongoDB } from "@/lib/db";
import localFont from "next/font/local";
import "./css/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import Link from "next/link";
import StaffUserButton from "./(protected)/_components/account/StaffUserButton";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  connectToMongoDB();
  async function Header() {
    return (
      <header className="flex justify-end p-4 bg-muted/40">
        <SignedIn>
          <StaffUserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/">Repair.sg</Link>
          <div className="ml-auto">
            <SignInButton />
          </div>
        </SignedOut>
      </header>
    );
  }
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          elements: {
            footer: "hidden",
          },
        }}
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header /> <Toaster />
          <TooltipProvider>{children}</TooltipProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
