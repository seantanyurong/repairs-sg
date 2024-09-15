"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
// import { useUser } from '@clerk/nextjs'

export default function PhoneSection() {
  // const { isLoaded, isSignedIn, user } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // TODO: Change to empty string
  // const [phone, setPhone] = useState<string>("81234567");
  // Dummy phone number
  const phone = "81234567";
  const [newPhone, setNewPhone] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  // Error setting for phone number
  useEffect(() => {
    if (newPhone.length !== 8 || ![8, 9].includes(parseInt(newPhone[0]))) {
      setError("Please enter a valid phone number");
      setDisabled(true);
    } else {
      setError("");
      setDisabled(false);
    }
  }, [newPhone]);

  // Setting the phone number to the user's phone number
  // useEffect(() => {
  //   if (isLoaded && isSignedIn) {
  //     console.log(user);
  //   }
  // }, [isLoaded, isSignedIn, user]);

  // if (!isLoaded || !isSignedIn) {
  //   return null
  // }

  const handleSave = () => {
    setIsEditing(false);
    // send the updated data to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  return (
    <div className="flex justify-between">
      <p className="text-[13px]">Phone Number</p>
      {!isEditing ? (
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500">{phone}</p>
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </div>
      ) : (
        <div className="flex flex-row w-[75%] justify-end space-x-4 shadow-md">
          <Card className="flex flex-col w-full">
            <CardHeader>
              <CardTitle className="text-sm">Update Phone Number</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between space-y-2">
              <Label className="text-sm text-gray-500">Phone Number</Label>
              <Input
                id="phoneNumber"
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-500px"
                placeholder={phone}
              />
              {error && <p className="text-red-500">{error}</p>}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="ghost" onClick={handleSave} disabled={disabled}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
