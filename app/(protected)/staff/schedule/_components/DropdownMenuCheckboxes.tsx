"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

type Items = {
  label: string
}

type MenuItem = {
  label: string;
  checked: boolean;
  disabled?: boolean;
}

// Creates a DropdowmMenu with checkboxes that modifies the query parameters for server-side filtering
type DropdownMenuCheckboxesProps = {
  items: Items[];  // JSON array to be passed as a prop
}

export function DropdownMenuCheckboxes({ items }: DropdownMenuCheckboxesProps) {
  // Convert items to an array of MenuItem objects with an "All" option
  const initialItems: MenuItem[] = [
    {
      label: "All",
      checked: true, // Default state is true
    },
    ...items.map((item) => ({
      label: item.label,
      checked: true, // Default state for individual items is also true
    })),
  ];

  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(initialItems);
  const router = useRouter();
  const searchParams = useSearchParams(); // To read the current query parameters

  const handleCheckedChange = (index: number, checked: Checked) => {
    const updatedItems = [...menuItems];

    if (index === 0) {
      // "All" option logic: when "All" is checked/unchecked, all items should follow
      updatedItems.forEach((item) => (item.checked = checked as boolean));
    } else {
      updatedItems[index].checked = checked as boolean;

      // If any item is unchecked, uncheck the "All" option
      if (!checked) {
        updatedItems[0].checked = false;
      } else {
        // If all items except "All" are checked, check the "All" option
        const allChecked = updatedItems.slice(1).every((item) => item.checked);
        updatedItems[0].checked = allChecked;
      }
    }

    setMenuItems(updatedItems);

    // Extract checked values, ignoring the "All" option
    const checkedValues = updatedItems
      .filter((item, idx) => item.checked && idx !== 0) // Exclude "All" from query
      .map((item) => item.label);

    // Get the current query params
    const currentParams = new URLSearchParams(searchParams?.toString() || "");

    // If "All" is selected, set `filters` to an empty string
    if (updatedItems[0].checked) {
      currentParams.set('filters', "all");
    } else {
      // If no items are checked, set filters to "none" or an empty string
      if (checkedValues.length === 0) {
        currentParams.set('filters', "none"); // Or use "" depending on your preference
      } else {
        // Update `filters` query param with checked values
        currentParams.set('filters', checkedValues.join(","));
      }
    }

    // Push the updated query params while preserving other parameters
    router.push(`/staff/schedule?${currentParams.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Staff</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={item.checked}
            onCheckedChange={(checked) => handleCheckedChange(index, checked)}
            disabled={item.disabled}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
