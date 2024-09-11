import { createClient } from "@/utils/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { UserResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function POST(req: NextRequest) {
  const { new_password } = await req.json();
  const supabase = createClient();
  const user: UserResponse = await supabase.auth.getUser();

  const { data, error } = await supabase.auth.updateUser({
    email: user.data.user?.email,
    password: new_password,
  });
  console.log(error);
  if (error) {
    return NextResponse.json(user, { status: 400 });
  }
  return NextResponse.json(data, { status: 200 });
}
