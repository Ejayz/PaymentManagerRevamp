import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.PROJECT_URL || "";
const SUPABASE_KEY = process.env.ANON_PUBLIC || "";

export default async function RoutesMiddleWare(request: NextRequest) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const auth= cookies().get("auth");
  
  const user = await supabase.auth.getUser(auth?.value);


  if (request.nextUrl.pathname.includes("/dashboard") && !user.data.user) {
    return NextResponse.redirect(new URL("/login",request.url));
  } else if (request.nextUrl.pathname.includes("/api/v1/ops/") && !user.data.user) {
    return NextResponse.redirect(new URL("/login",request.url));
  }else{
    return NextResponse.next();
  }
  
}
// Configuration object for matcher
export const config = {
  matcher: "/:path*",
};
