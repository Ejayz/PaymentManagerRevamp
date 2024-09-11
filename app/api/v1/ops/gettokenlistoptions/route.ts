import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const data = await supabase
    .from("tbl_token")
    .select("")
    .eq("user_id", user.data.user?.id)
    .eq("is_exist", true);

  if (data.error) {
    return NextResponse.json(data, { status: 400 });
  }
  return NextResponse.json(data.data, { status: 200 });
}
