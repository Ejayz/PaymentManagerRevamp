import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";



export async function POST(req: NextRequest) {
  const { site_id } = await req.json();
  const supabase= createClient()
  const user= await supabase.auth.getUser()
  const data = await supabase
    .from("tbl_site")
    .update({
      is_exist: false,
    })
    .eq("site_id", site_id)
    .eq("user_id", user.data.user?.id)
    .select();
    
  if (data.error) {
    return NextResponse.json(data, { status: 200 });
  }
  return NextResponse.json(data, { status: 200 });
}
