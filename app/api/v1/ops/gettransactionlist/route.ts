import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";



export async function GET(req: NextRequest) {
  const page = (await req.nextUrl.searchParams.get("page")) || "1";
  const search = (await req.nextUrl.searchParams.get("search")) || "";
  const limit = (await req.nextUrl.searchParams.get("limit")) || "10";
  const site = (await req.nextUrl.searchParams.get("site")) || "";
  const status = (await req.nextUrl.searchParams.get("status")) || "";
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  let data;

  if (status == "all" && site != "all") {
    console.log("status == all && site != all");
    data = await supabase
      .from("tbl_transaction")
      .select("*,tbl_token(*),tbl_site(site_name,site_link,description,auto_payment,is_exist,site_id)")
      .or(`transaction_id.ilike.%${search}%,to_user.ilike.%${search}%`)
      .eq("user_id", user.data.user?.id)
      .eq("is_exist", true)
      .eq("site_id", site)
      .range(
        (parseInt(page) - 1) * parseInt(limit),
        parseInt(page) * parseInt(limit) - 1
      )
      .order("created_at", { ascending: false });
  } else if (status != "all" && site == "all") {
    console.log("status != all && site == all");
    data = await supabase
      .from("tbl_transaction")
      .select("*,tbl_token(*),tbl_site(site_name,site_link,description,auto_payment,is_exist,site_id)")
      .or(`transaction_id.ilike.%${search}%,to_user.ilike.%${search}%`)
      .eq("user_id", user.data.user?.id)
      .eq("is_exist", true)
      .eq("status", status)
      .range(
        (parseInt(page) - 1) * parseInt(limit),
        parseInt(page) * parseInt(limit) - 1
      )
      .order("created_at", { ascending: false });
  } else if (status != "all" && site != "all") {
    console.log("status != all && site != all");
    data = await supabase
      .from("tbl_transaction")
      .select("*,tbl_token(*),tbl_site(site_name,site_link,description,auto_payment,is_exist,site_id)")
      .or(`transaction_id.ilike.%${search}%,to_user.ilike.%${search}%`)
      .eq("user_id", user.data.user?.id)
      .eq("is_exist", true)
      .eq("site_id", site)
      .eq("status", status)
      .range(
        (parseInt(page) - 1) * parseInt(limit),
        parseInt(page) * parseInt(limit) - 1
      )
      .order("created_at", { ascending: false });
  } else {
    console.log("else");
    data = await supabase
      .from("tbl_transaction")
      .select("*,tbl_token(*),tbl_site(site_name,site_link,description,auto_payment,is_exist,site_id)")
      .or(`transaction_id.ilike.%${search}%,to_user.ilike.%${search}%`)
      .eq("user_id", user.data.user?.id)
      .eq("is_exist", true)
      .range(
        (parseInt(page) - 1) * parseInt(limit),
        parseInt(page) * parseInt(limit) - 1
      )
      .order("created_at", { ascending: false });
  }
  console.log(data);
  if (data?.error) {
    return NextResponse.json(data, { status: 400 });
  }

  return NextResponse.json(data?.data, { status: 200 });
}
