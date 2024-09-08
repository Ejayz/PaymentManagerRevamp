import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function POST(req: NextRequest) {
  const {
    site_id,
    site_name,
    site_link,
    description,
    auto_payment,
    faucetpay_api_key,
  } = await req.json();
  console.log(site_id, site_name, site_link, description, auto_payment,faucetpay_api_key);
  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);
  const auth = cookies().get("auth");
  const user = await supabase.auth.getUser(auth?.value);
  let data = null;

  if (faucetpay_api_key == "faucet-pay-api-key") {
    data = await supabase
      .from("tbl_site")
      .update({
        site_name: site_name,
        site_link: site_link,
        description: description,
        auto_payment: auto_payment,
      })
      .eq("site_id", site_id)
      .eq("user_id", user.data.user?.id).select();
  } else {
    data = await supabase
      .from("tbl_site")
      .update({
        site_name: site_name,
        site_link: site_link,
        description: description,
        auto_payment: auto_payment,
        faucetpay_api_key: faucetpay_api_key,
      })
      .eq("site_id", site_id)
      .eq("user_id", user.data.user?.id).select();
  }


  if (data.error) {
    return NextResponse.json(data, { status: 200 });
  }
  return NextResponse.json(data, { status: 200 });
}
