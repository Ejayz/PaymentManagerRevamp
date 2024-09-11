import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(PROJECT_URL, ANON_PUBLIC, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        const oneHourInSeconds = 3600;
        cookiesToSet.forEach(({ name, value, options }) => {
          // Create an expiration date for 1 hour from now
          const expires = new Date(Date.now() + oneHourInSeconds * 1000).toUTCString();

          // Only set the cookie if it is not already present
          if (!request.cookies.get(name)) {
            supabaseResponse.cookies.set(name, value, {
              ...options,
              expires:expires,
              maxAge: oneHourInSeconds,
            });
          }
        });
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const { data } = await supabase.auth.getUser();

  if (
    !data.user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/dashboard") &&
    !request.nextUrl.pathname.includes("/api/v1/ops") &&
    !request.nextUrl.pathname.includes("/api/auth")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  } else if (!data.user && request.nextUrl.pathname.startsWith("/api/external")) {
    return supabaseResponse;
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
