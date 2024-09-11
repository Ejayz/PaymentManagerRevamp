import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
  const { transaction_id } = await req.json();
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("tbl_transaction")
    .update({ status: "Declined" })
    .eq("transaction_id", transaction_id)
    .eq("user_id", user.data.user?.id);
  if (error) {
    return NextResponse.json(error, { status: 400 });
  }
  return NextResponse.json(data, { status: 200 });
}
