import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-semibold text-foreground text-sm tracking-tight"
            >
              Sistema CleanUp
            </Link>
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Principal">
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                CTOs
              </Link>
              <Link
                href="/dashboard/nova-cto"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Novo clean up
              </Link>
            </nav>
          </div>
          <SignOutButton size="sm" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
