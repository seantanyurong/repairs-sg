"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  Hammer,
  Home,
  LineChart,
  NotepadText,
  PanelLeft,
  Quote,
  Settings,
  Truck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import "../../css/globals.css";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAVIGATION_LABELS } from "../../constants";

export function generateBreadcrumbs(pathname: string | null): React.ReactNode {
  if (!pathname) return null;

  if (pathname === "/staff") {
    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/staff">{NAVIGATION_LABELS.HOME}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  }

  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment !== "" && segment !== "staff");

  return (
    <BreadcrumbList>
      {pathSegments.map((segment, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink asChild>
            <Link
              href={`/${["staff", ...pathSegments.slice(0, index + 1)].join(
                "/"
              )}`}
            >
              {kebabToTitleCase(segment)}
            </Link>
          </BreadcrumbLink>
          {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      ))}
    </BreadcrumbList>
  );
}

// Convert kebab-case to title case
function kebabToTitleCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkPublishableKey) {
    throw new Error(
      "Missing Clerk publishable key. Please add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to your environment variables."
    );
  }

  // Closing of the side panel when a link is clicked
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleLinkClick = (): void => {
    setIsOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/staff"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Home className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">{NAVIGATION_LABELS.HOME}</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/services"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/services"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Hammer className="h-5 w-5" />
                <span className="sr-only">{NAVIGATION_LABELS.SERVICES}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.SERVICES}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/schedule"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/schedule"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <CalendarDays className="h-5 w-5" />
                <span className="sr-only">{NAVIGATION_LABELS.SCHEDULE}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.SCHEDULE}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/jobs"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <BriefcaseBusiness className="h-5 w-5" />
                <span className="sr-only">{NAVIGATION_LABELS.JOBS}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.JOBS}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/invoices"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <NotepadText className="h-5 w-5" />
                <span className="sr-only">{NAVIGATION_LABELS.INVOICES}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.INVOICES}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/quote/templates"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/quote/templates"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Quote className="h-5 w-5" />
                <span className="sr-only">
                  {NAVIGATION_LABELS.QUOTATION_TEMPLATES}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.QUOTATION_TEMPLATES}
            </TooltipContent>
          </Tooltip>
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/quote/"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/quote/"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Receipt className="h-5 w-5" />
                <span className="sr-only">{NAVIGATION_LABELS.QUOTATIONS}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.QUOTATIONS}
            </TooltipContent>
          </Tooltip> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/customers"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <UserRound className="h-5 w-5" />
                <span className="sr-only">{NAVIGATION_LABELS.CUSTOMERS}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.CUSTOMERS}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/vehicles"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/vehicles"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Truck className="h-5 w-5" />
                <span className="sr-only">{NAVIGATION_LABELS.VEHICLES}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.VEHICLES}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/staff/analytics"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/analytics"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <LineChart className="h-5 w-5" />
                <span className="sr-only">{NAVIGATION_LABELS.ANALYTICS}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.ANALYTICS}
            </TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === "/staff/schedule"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">{NAVIGATION_LABELS.SETTINGS}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.SETTINGS}
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Side Toggle Menu */}
          <Sheet
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="sm:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="sm:max-w-xs bg-secondary border-0"
            >
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/staff"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  onClick={handleLinkClick}
                >
                  <Home className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">{NAVIGATION_LABELS.HOME}</span>
                </Link>
                <Link
                  href="/staff/services"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/staff/services"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleLinkClick}
                >
                  <Hammer className="h-5 w-5" />
                  {NAVIGATION_LABELS.SERVICES}
                </Link>
                <Link
                  href="/staff/schedule"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/staff/schedule"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleLinkClick}
                >
                  <CalendarDays className="h-5 w-5" />
                  {NAVIGATION_LABELS.SCHEDULE}
                </Link>
                <Link
                  href="#"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/staff/jobs"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleLinkClick}
                >
                  <BriefcaseBusiness className="h-5 w-5" />
                  {NAVIGATION_LABELS.JOBS}
                </Link>
                <Link
                  href="#"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/staff/invocies"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleLinkClick}
                >
                  <NotepadText className="h-5 w-5" />
                  {NAVIGATION_LABELS.INVOICES}
                </Link>
                <Link
                  href="/staff/quote/templates"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/staff/quote/templates"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleLinkClick}
                >
                  <Quote className="h-5 w-5" />
                  {NAVIGATION_LABELS.QUOTATIONS}
                </Link>
                <Link
                  href="#"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/staff/customers"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleLinkClick}
                >
                  <UserRound className="h-5 w-5" />
                  {NAVIGATION_LABELS.CUSTOMERS}
                </Link>
                <Link
                  href="/staff/vehicles"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/staff/vehicles"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleLinkClick}
                >
                  <Truck className="h-5 w-5" />
                  {NAVIGATION_LABELS.VEHICLES}
                </Link>
                <Link
                  href="/staff/analytics"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/staff/analytics"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleLinkClick}
                >
                  <LineChart className="h-5 w-5" />
                  {NAVIGATION_LABELS.ANALYTICS}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  onClick={handleLinkClick}
                >
                  <Settings className="h-5 w-5" />
                  {NAVIGATION_LABELS.SETTINGS}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            {generateBreadcrumbs(pathname)}
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0"></div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
