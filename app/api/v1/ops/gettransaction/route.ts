import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
  const transaction_id = req.nextUrl.searchParams.get("transaction_id");
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const data = await supabase
    .from("tbl_transaction")
    .select("*,tbl_site(site_name,site_link,description,auto_payment,is_exist,site_id),tbl_token(*)")
    .eq("transaction_id", transaction_id)
    .eq("user_id", user.data.user?.id);
    console.log(data)
  if (data.error) {
    return NextResponse.json(data, { status: 400 });
  }
  return NextResponse.json(data.data, { status: 200 });
}
