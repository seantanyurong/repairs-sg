import '../css/globals.css';
import { ClerkProvider, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import UserButtonCustom from './_components/account/userButtonCustom';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  function Header() {
    return (
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
        <Link href='/'>Repairs.sg</Link>
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
