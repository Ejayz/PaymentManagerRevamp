import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
const supabase = createClient();

  const site_id = req.nextUrl.searchParams.get("site_id");

  const user= await supabase.auth.getUser();

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
