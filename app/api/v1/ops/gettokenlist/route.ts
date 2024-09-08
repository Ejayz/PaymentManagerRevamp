import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function GET(req: NextRequest) {
  const page = (await req.nextUrl.searchParams.get("page")) || "1";
  const search = (await req.nextUrl.searchParams.get("search")) || "";
  const limit = (await req.nextUrl.searchParams.get("limit")) || "10";
  console.log(page, search, limit);
  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);
  const auth = cookies().get("auth");
  const user = await supabase.auth.getUser(auth?.value);
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

    console.log(data);

  if (data.error) {
    return NextResponse.json(data, { status: 400 });
  }
  return NextResponse.json(data.data, { status: 200 });
}
