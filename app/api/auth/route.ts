import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Set-Cookie": `auth=${data.session.access_token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=3600`,
    },
  });
}
