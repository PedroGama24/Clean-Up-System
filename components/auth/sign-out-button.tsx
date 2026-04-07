"use client";

import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type SignOutButtonProps = {
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
};

export function SignOutButton({
  variant = "outline",
  size = "default",
  className,
}: SignOutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
      onClick={handleSignOut}
    >
      {pending ? "Saindo…" : "Sair"}
    </Button>
  );
}
