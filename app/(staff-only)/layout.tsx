"use client";

import "../css/globals.css";
import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  Hammer,
  Home,
  LineChart,
  NotepadText,
  PanelLeft,
  Quote,
  Search,
  Settings,
  Truck,
  UserRound,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { NAVIGATION_LABELS } from "./constants";
import { usePathname } from "next/navigation";

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
              {capitalise(segment)}
            </Link>
          </BreadcrumbLink>
          {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      ))}
    </BreadcrumbList>
  );
}

function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
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
                href="#"
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
                <span className="sr-only">{NAVIGATION_LABELS.QUOTATIONS}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {NAVIGATION_LABELS.QUOTATIONS}
            </TooltipContent>
          </Tooltip>
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
                href="#"
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
                href="#"
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
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/staff"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Home className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">{NAVIGATION_LABELS.HOME}</span>
                </Link>
                <Link
                  href="/staff/services"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  {NAVIGATION_LABELS.SERVICES}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <CalendarDays className="h-5 w-5" />
                  {NAVIGATION_LABELS.SCHEDULE}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <BriefcaseBusiness className="h-5 w-5" />
                  {NAVIGATION_LABELS.JOBS}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <NotepadText className="h-5 w-5" />
                  {NAVIGATION_LABELS.INVOICES}
                </Link>
                <Link
                  href="/staff/quote/templates"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Quote className="h-5 w-5" />
                  {NAVIGATION_LABELS.QUOTATIONS}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <UserRound className="h-5 w-5" />
                  {NAVIGATION_LABELS.CUSTOMERS}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Truck className="h-5 w-5" />
                  {NAVIGATION_LABELS.VEHICLES}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  {NAVIGATION_LABELS.ANALYTICS}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            {generateBreadcrumbs(pathname)}
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/images/placeholder.svg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
