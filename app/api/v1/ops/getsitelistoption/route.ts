
import { NextRequest, NextResponse } from "next/server";
import {createClient} from "@/utils/supabase/server";


export async function GET(req: NextRequest) {
 const supabase= createClient()
const user = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("tbl_site")
    .select("site_name,site_link,description,auto_payment,is_exist,site_id")
    .eq("user_id", user.data.user?.id)
    .eq("is_exist", true)
    .order("created_at", { ascending: false });
console.log(error)
console.log(data)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, {
    status: 200,
  });
}
