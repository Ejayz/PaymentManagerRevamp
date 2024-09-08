import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function POST(req: NextRequest) {
  const { token_id } = await req.json();
  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);
  const auth = cookies().get("auth");
  const user = await supabase.auth.getUser(auth?.value);

  const { data, error } = await supabase
    .from("tbl_token")
    .update({ is_exist: false })
    .eq("id", token_id)
    .eq("user_id", user.data.user?.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    return NextResponse.json(data, { status: 200 });
  }
}
