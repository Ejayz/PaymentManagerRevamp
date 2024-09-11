import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "0";
  const limit = req.nextUrl.searchParams.get("limit") || "10";
  const search = req.nextUrl.searchParams.get("search");

  const supabase = createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("tbl_site")
    .select("site_name,site_link,description,auto_payment,is_exist,site_id")
    .eq("user_id", user.data.user?.id)
    .eq("is_exist", true)
    .or(
      `site_name.ilike.%${search}%,site_link.ilike.%${search}%,description.ilike.%${search}%,site_id_text.ilike.%${search}%`
    )
    .order("created_at", { ascending: false })
    .range(
      (parseInt(page) - 1) * parseInt(limit),
      parseInt(page) * parseInt(limit) - 1
    );
  console.log(error);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, {
    status: 200,
  });
}
