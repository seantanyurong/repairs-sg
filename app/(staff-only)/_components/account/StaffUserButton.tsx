"use client";
import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function StaffUserButton() {
  return (
    <UserButton appearance={{ elements: {userButtonAvatarBox: "h-10 w-10" } }}>
      <UserButton.MenuItems>
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
      <UserButton.UserProfilePage label="account" />
      <UserButton.UserProfilePage label="security" />
    </UserButton>
  );
}
