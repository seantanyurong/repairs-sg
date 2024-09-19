"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import PhoneForm from "../phoneForm/PhoneForm";

export default function PhoneSection() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const phone = user?.unsafeMetadata.phone;

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="flex justify-between">
      <p className="text-[13px]">Phone Number</p>
      {!isEditing ? (
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500">{phone as string}</p>
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            {phone ? "Edit" : "Add"}
          </Button>
        </div>
      ) : isEditing ? (
        <PhoneForm setIsEditing={setIsEditing} />
      ) : null}
    </div>
  );
}
