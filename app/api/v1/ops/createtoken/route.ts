import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function POST(req: NextRequest) {
  const { currency_name, currency_code } = await req.json();

const supabase= createClient();
const user= await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("tbl_token")
    .insert({
      currency_name,
      currency_code,
      user_id: user.data.user?.id,
    })
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 200 });
}
