import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function POST(req: NextRequest) {
  const { site_id } = await req.json();
  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);
  const auth = cookies().get("auth");
  const user = await supabase.auth.getUser(auth?.value);
  const data = await supabase
    .from("tbl_site")
    .update({
      is_exist: false,
    })
    .eq("site_id", site_id)
    .eq("user_id", user.data.user?.id)
    .select();
    
  if (data.error) {
    return NextResponse.json(data, { status: 200 });
  }
  return NextResponse.json(data, { status: 200 });
}
