import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";
const REFERENCE_ID = process.env.REFERENCE_ID || "";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  return NextResponse.json(data, {
    status: 200,
  });
}
