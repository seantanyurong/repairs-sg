import React from "react";
import Link from "next/link";
import { STAFFTABS } from "@/constants";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import UserButtonCustom from "@/app/account/userButtonCustom";

const StaffSignInNavbar = () => {
  return (
    <nav className="flex items-center justify-between w-full p-4 bg-gray-100 text-gray-700 hover:text-black transition">
      {/* Left side: Logo */}
      {/* <Logo /> */}
      <Link href="/">Repairs.sg</Link>

      {/* Spacer to push tabs to the right */}
      <div className="flex-grow"></div>

      {/* Signed In */}
      <SignedIn>
        {/* Center: Tabs (Hidden on small screens) */}
        <ul className="hidden md:flex justify-between px-4 mx-4 space-x-4">
          {STAFFTABS.map((tab, idx) => (
            <li key={idx} className="flex-1 text-center">
              <a href={`#${tab.toLowerCase()}`}>{tab}</a>
            </li>
          ))}
        </ul>
        <UserButtonCustom />
      </SignedIn>

      {/* Signed Out */}
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </nav>
  );
};

export default StaffSignInNavbar;
