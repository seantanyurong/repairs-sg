import { ClerkProvider } from "@clerk/nextjs";
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
