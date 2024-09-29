"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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

type StaffName = {
  fullName: string
}

type MenuItem = {
  label: string;
  checked: boolean;
  disabled?: boolean;
}

// Creates a DropdowmMenu with checkboxes that modifies the query parameters for server-side filtering
type DropdownMenuCheckboxesProps = {
  items: StaffName[];  // JSON array to be passed as a prop
}

export function DropdownMenuCheckboxes({ items }: DropdownMenuCheckboxesProps) {
  // I want to take items and convert them to an array of MenuItem objects
  const modifiedItem = items.map((item) => {
    return {
      label: item.fullName,
      checked: false,
    };
  });

  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(modifiedItem);
  const router = useRouter();

  const handleCheckedChange = (index: number, checked: Checked) => {
    const updatedItems = [...menuItems];
    updatedItems[index].checked = checked as boolean;
    setMenuItems(updatedItems);

    // Extract checked values
    const checkedValues = updatedItems
      .filter((item) => item.checked)
      .map((item) => item.label);

    // Construct query string
    const queryString = 'filters=' + checkedValues.join(",");
    // Push the query string to the URL
    router.push(`/staff/scheduling?${queryString}`);
  
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
