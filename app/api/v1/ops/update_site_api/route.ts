import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { site_id, api_key } = await req.json();
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("tbl_site")
    .update({ api_key })
    .eq("site_id", site_id)
    .eq("user_id", user.data.user?.id);
    console.log(error)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    return NextResponse.json(data, { status: 200 });
  }
}
