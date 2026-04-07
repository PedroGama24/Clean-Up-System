import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(({ name, value }) => {
    to.cookies.set(name, value);
  });
}

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthPath = path === "/login" || path === "/register";
  const isPendingPath = path === "/pending-approval";
  const isDashboardPath = path.startsWith("/dashboard");

  let approved = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("approved")
      .eq("id", user.id)
      .maybeSingle();
    approved = profile?.approved === true;
  }

  const redirectWithSession = (to: URL) => {
    const res = NextResponse.redirect(to);
    copyCookies(supabaseResponse, res);
    return res;
  };

  if (isDashboardPath) {
    if (!user) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", path);
      return redirectWithSession(login);
    }
    if (!approved) {
      return redirectWithSession(new URL("/pending-approval", request.url));
    }
  }

  if (isPendingPath) {
    if (!user) {
      return redirectWithSession(new URL("/login", request.url));
    }
    if (approved) {
      return redirectWithSession(new URL("/dashboard", request.url));
    }
  }

  if (isAuthPath && user) {
    if (approved) {
      return redirectWithSession(new URL("/dashboard", request.url));
    }
    return redirectWithSession(new URL("/pending-approval", request.url));
  }

  return supabaseResponse;
}
