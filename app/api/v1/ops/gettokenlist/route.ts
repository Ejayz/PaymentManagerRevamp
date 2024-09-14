import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const page = (await req.nextUrl.searchParams.get("page")) || "1";
  const search = (await req.nextUrl.searchParams.get("search")) || "";
  const limit = (await req.nextUrl.searchParams.get("limit")) || "10";
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const data = await supabase
    .from("tbl_token")
    .select("*")
    .or(`currency_name.ilike.%${search}%,currency_code.ilike.%${search}%`)
    .eq("user_id", user.data.user?.id)
    .eq("is_exist", true)
    .range(
      (parseInt(page) - 1) * parseInt(limit),
      parseInt(page) * parseInt(limit) - 1
    )
    .order("created_at", { ascending: false });



  if (data.error) {
    return NextResponse.json(data, { status: 400 });
  }
  return NextResponse.json(data.data, { status: 200 });
}
