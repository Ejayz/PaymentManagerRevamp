import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token_id } = await req.json();
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("tbl_token")
    .update({ is_exist: false })
    .eq("id", token_id)
    .eq("user_id", user.data.user?.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    return NextResponse.json(data, { status: 200 });
  }
}
