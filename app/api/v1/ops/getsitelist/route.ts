import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "0";
  const limit = req.nextUrl.searchParams.get("limit") || "10";
  const search = req.nextUrl.searchParams.get("search");

  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);

  const auth = cookies().get("auth");
  const user = await supabase.auth.getUser(auth?.value);

  const { data, error } = await supabase
    .from("tbl_site")
    .select("*")
    .eq("user_id", user.data.user?.id)
    .or(
      `site_name.ilike.%${search}%,site_link.ilike.%${search}%,description.ilike.%${search}%,site_id_text.ilike.%${search}%`
    )
    .order("created_at", { ascending: false })
    .range(
      (parseInt(page) - 1) * parseInt(limit),
      parseInt(page) * parseInt(limit) - 1
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, {
    status: 200,
  });
}
