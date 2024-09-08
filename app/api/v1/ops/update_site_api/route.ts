import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function POST(req: NextRequest) {
  const { site_id, api_key } = await req.json();
  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);
  const auth = cookies().get("auth");

  const user = await supabase.auth.getUser(auth?.value);

  const { data, error } = await supabase
    .from("tbl_site")
    .update({ api_key })
    .eq("site_id", site_id)
    .eq("user_id", user.data.user?.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    return NextResponse.json(data, { status: 200 });
  }
}
