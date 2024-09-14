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
    .eq("user_id", user.data.user?.id)
    .select();
  let headersList = {
    Accept: "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Content-Type": "application/json",
  };
  if (!data || data.length == 0) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 400 }
    );
  }
  let bodyContent = JSON.stringify(data[0]);

  let response = await fetch(data[0].callback_url, {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  const status = response.json();

  if (error) {
    return NextResponse.json(error, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
