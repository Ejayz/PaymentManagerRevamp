import { NextRequest, NextResponse } from "next/server";
import * as dotenv from "dotenv";
import { createClient } from "@/utils/supabase/server";

dotenv.config();


export async function POST(req: NextRequest) {
  const { site_name, site_link, description, faucetpay_api_key, auto_payment } =
    await req.json();

  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (
    site_name == "" ||
    site_link == "" ||
    description == "" ||
    faucetpay_api_key == ""
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  } else {
    const data = await supabase.from("tbl_site").insert([
      {
        site_name: site_name,
        site_link: site_link,
        description: description,
        faucetpay_api_key: faucetpay_api_key,
        auto_payment: auto_payment,
        user_id: user?.data?.user?.id,
      },
    ]);
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    } else {
      return NextResponse.json(data, {
        status: 200,
      });
    }
  }
}
