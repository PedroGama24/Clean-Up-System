import Link from "next/link";
import { Network } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-15%,oklch(0.92_0.04_250/0.22),transparent)] dark:bg-[radial-gradient(ellipse_70%_45%_at_50%_-15%,oklch(0.28_0.06_250/0.18),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0_0_0/0.025)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.025)_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] mask-[linear-gradient(to_bottom,black,transparent_85%)] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.03)_1px,transparent_1px)]"
        aria-hidden
      />

      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-border/60 border-b bg-background/90 shadow-sm shadow-black/[0.02] backdrop-blur-md supports-[backdrop-filter]:bg-background/75 dark:shadow-black/20">
          <div className="mx-auto flex h-14 w-full max-w-none items-center justify-between gap-3 px-4 sm:h-[3.75rem] sm:gap-4 sm:px-6 lg:px-10 xl:px-12">
            <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-8">
              <Link
                href="/dashboard"
                className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Sistema CleanUp — ir para painel de CTOs"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm ring-1 ring-foreground/10 sm:size-9">
                  <Network
                    className="size-4 sm:size-[1.15rem]"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>
                <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                  <span className="font-semibold text-foreground text-sm tracking-tight">
                    Sistema CleanUp
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Virtus Telecom · Backoffice
                  </span>
                </span>
              </Link>
              <nav
                className="flex items-center gap-0.5 sm:gap-1"
                aria-label="Principal"
              >
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

        <main className="relative flex-1">
          <div className="mx-auto w-full max-w-none px-4 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
