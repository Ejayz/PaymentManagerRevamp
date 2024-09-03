import { NextRequest, NextResponse } from "next/server";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
dotenv.config();
const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";

export async function POST(req: NextRequest) {
  const { site_name, site_link, description, faucetpay_api_key, auto_payment } =
    await req.json();

  const supabase = createClient(PROJECT_URL, ANON_PUBLIC);
  const auth = cookies().get("auth");
const user = await supabase.auth.getUser(auth?.value);

const id= supabase.auth.getUserIdentities()

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
    const { data, error } = await supabase.from("tbl_site").insert([
      {
        site_name: site_name,
        site_link: site_link,
        description: description,
        faucetpay_api_key: faucetpay_api_key,
        auto_payment: auto_payment,
        user_id: user?.data?.user?.id
      },
    ]);
    console.log(data,error)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, {
      status: 200,
    });
  }
}
