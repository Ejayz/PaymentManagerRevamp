import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";



export async function GET(req: NextRequest) {
  const token_id = req.nextUrl.searchParams.get("token_id") || "0";
  const supabase= createClient()
  const user= await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("tbl_token")
    .select("*")
    .eq("user_id", user.data.user?.id)
    .eq("is_exist", true)
    .eq("id", token_id);
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, {
    status: 200,
  });
}
