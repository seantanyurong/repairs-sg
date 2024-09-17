import UserButtonCustom from "@/app/(public)/_components/account/UserButtonCustom";
import "../../css/globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  function Header() {
    return (
      <header className="flex justify-between p-4">
        <Link href="/">Repairs.sg</Link>
        <SignedIn>
          <UserButtonCustom />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </header>
    );
  }

  return (
    <ClerkProvider>
      <Header />
      {children}
    </ClerkProvider>
  );
}
