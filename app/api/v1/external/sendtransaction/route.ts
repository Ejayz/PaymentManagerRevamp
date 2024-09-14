import { createClient } from "@/utils/supabase/server";
import { SupabaseClient, UserResponse } from "@supabase/supabase-js";
import { callback } from "chart.js/helpers";
import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { send } from "process";

export async function POST(req: NextRequest) {
  const api_key = req.nextUrl.searchParams.get("api_key") || "";
  const site_id = req.nextUrl.searchParams.get("site_id") || "";
  const { amount, currency_code, refferal, wallet_address, callback_url } =
    await req.json();
  const supabase = createClient();

console.log(req.headers.get("referer"));
  const { data, error } = await supabase
    .from("tbl_site")
    .select()
    .eq("site_id", site_id)
    .eq("api_key", api_key)
    .eq("is_exist", true);
  if (error) {
    return NextResponse.json(
      { error: "Invalid Site ID", error_code: "INVALID_SITE_ID" },
      { status: 400 }
    );
  }
  if (data.length === 0) {
    return NextResponse.json(
      { error: "Invalid Site ID", error_code: "INVALID_SITE_ID" },
      { status: 400 }
    );
  }
 
  if (data[0].site_link != req.headers.get("referer")) {
    return NextResponse.json(
      {
        error: "Invalid Origin Request.",
        error_code: "INVALID_ORIGIN_REQUEST",
      },
      { status: 400 }
    );
  }

  const { data: currencyData, error: currencyError } = await supabase
    .from("tbl_token")
    .select()
    .eq("currency_code", currency_code)
    .eq("user_id", data[0].user_id)
    .eq("is_exist", true);
  if (currencyError) {
    return NextResponse.json(
      { error: "Invalid Currency Code", error_code: "INVALID_CURRENCY_CODE" },
      { status: 400 }
    );
  }
  if (currencyData.length === 0) {
    return NextResponse.json(
      { error: "Invalid Currency Code", error_code: "INVALID_CURRENCY_CODE" },
      { status: 400 }
    );
  }

  const faucetpay_api_key = data[0].faucetpay_api_key;

  let faucetPay;

  if (data[0].auto_payment) {
    faucetPay = await sendTransactionToFaucetPay(
      amount,
      refferal,
      wallet_address,
      faucetpay_api_key,
      currency_code
    );
    console.log(faucetPay);
    const transactionRecord = await createTransactionRecord(
      supabase,
      data[0].user_id,
      site_id,
      currencyData[0].id,
      amount,
      refferal,
      wallet_address,
      faucetPay,
      callback_url
    );

    if (!transactionRecord) {
      return NextResponse.json(
        {
          error: "Error creating transaction record",
          error_code: "ERROR_CREATING_TRANSACTION_RECORD",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { data: "Transaction created successfully" },
        { status: 200 }
      );
    }
  } else {
    const transactionRecord = await createManualTransactionRecord(
      supabase,
      data[0].user_id,
      site_id,
      currencyData[0].id,
      amount,
      refferal,
      wallet_address,
      callback_url
    );

    if (!transactionRecord) {
      return NextResponse.json(
        {
          error: "Error creating transaction record",
          error_code: "ERROR_CREATING_TRANSACTION_RECORD",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { data: "Transaction created successfully" },
        { status: 200 }
      );
    }
  }
}

const sendTransactionToFaucetPay = async (
  amount: string,
  refferal: string,
  wallet_address: string,
  faucetpay_api_key: string,
  currency_code: string
) => {
  let headersList = {
    Accept: "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  };

  let bodyContent = new FormData();
  bodyContent.append("api_key", faucetpay_api_key);
  bodyContent.append("amount", amount);
  bodyContent.append("to", wallet_address);
  bodyContent.append("currency", currency_code);
  bodyContent.append("referral", refferal);

  let response = await fetch("https://faucetpay.io/api/v1/send", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let faucetpaydata = await response.json();
  if (faucetpaydata.status != 200) {
    return NextResponse.json({ error: faucetpaydata.message }, { status: 400 });
  }
  return faucetpaydata;
};

const createTransactionRecord = async (
  supabase: SupabaseClient,
  user: UserResponse,
  site_id: string,
  currency_id: string,
  amount: number,
  refferal: boolean,
  wallet_address: string,
  faucetpay_data: any,
  callback_url: string
) => {
  const { data, error } = await supabase
    .from("tbl_transaction")
    .insert({
      currency: currency_id,
      to_user: wallet_address,
      current_balance: faucetpay_data.balance,
      status: faucetpay_data.status == 200 ? "Sent" : "Declined",
      payout_user_hash: faucetpay_data.payout_user_hash,
      payout_id: faucetpay_data.payout_id,
      refferal: refferal,
      user_id: user,
      hash_number: faucetpay_data.hash_number,
      site_id: site_id,
      type: "Automatic",
      transaction_id: randomBytes(8).toString("hex"),
      is_exist: true,
      amount: parseFloat(amount.toString()),
      callback_url: callback_url,
    }).select();

    let headersList = {
      "Accept": "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json"
     }
     if(!data||data.length == 0){
        return false;
      }

     let bodyContent = JSON.stringify(data[0]);
     
     let response = await fetch(callback_url, { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     
  if (error) {
    return false;
  }
  return data;
};

const createManualTransactionRecord = async (
  supabase: SupabaseClient,
  user: UserResponse,
  site_id: string,
  currency_id: string,
  amount: number,
  refferal: boolean,
  wallet_address: string,
  callback_url: string
) => {
  const { data, error } = await supabase
    .from("tbl_transaction")
    .insert({
      currency: currency_id,
      to_user: wallet_address,
      status: "Pending",
      refferal: refferal,
      user_id: user,
      site_id: site_id,
      type: "Manual",
      transaction_id: randomBytes(8).toString("hex"),
      is_exist: true,
      amount: parseFloat(amount.toString()),
      callback: callback_url,
    })
    .select();
  console.log("error:", error);
  console.log(data);
  if (error) {
    return false;
  }
  return data;
};

const getCurrency = async (
  supabase: SupabaseClient,
  user: UserResponse,
  currency: string
) => {
  const { data, error } = await supabase
    .from("tbl_token")
    .select("*")
    .eq("id", currency)
    .eq("user_id", user.data.user?.id)
    .eq("is_exist", true);
  console.log(error);
  if (error) {
    return false;
  }
  return data;
};

const getSite = async (
  supabase: SupabaseClient,
  user: UserResponse,
  site_id: string
) => {
  const { data, error } = await supabase
    .from("tbl_site")
    .select("*")
    .eq("site_id", site_id)
    .eq("user_id", user.data.user?.id)
    .eq("is_exist", true);
  console.log(error);
  if (error) {
    return false;
  }
  return data;
};
