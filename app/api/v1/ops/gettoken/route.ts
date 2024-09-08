import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function GET(req: NextRequest) {
  const token_id = req.nextUrl.searchParams.get("token_id") || "0";
  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);
  const auth = cookies().get("auth");
  const user = await supabase.auth.getUser(auth?.value);
  const { data, error } = await supabase
    .from("tbl_token")
    .select("*")
    .eq("user_id", user.data.user?.id)
    .eq("is_exist", true)
    .eq("id", token_id);

console.log(error)


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, {
    status: 200,
  });
}
