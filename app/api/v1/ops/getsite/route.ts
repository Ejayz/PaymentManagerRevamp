import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function GET(req: NextRequest) {
  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);

  const site_id = req.nextUrl.searchParams.get("site_id");

  const auth = cookies().get("auth");

  const user = await supabase.auth.getUser(auth?.value);

  const { data, error } = await supabase
    .from("tbl_site")
    .select(
      "site_id, site_name, site_link, description,auto_payment,created_at,updated_at,is_exist"
    )
    .eq("site_id", site_id)
    .eq("user_id", user.data.user?.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 200 });
}
