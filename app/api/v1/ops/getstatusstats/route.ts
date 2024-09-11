import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data, error } = await supabase
  .rpc('get_status_summary');

console.log(data)
if (error) {
  console.error('Error fetching data:', error);
  return NextResponse.json({ error: error.message }, { status: 400 });
}
  return NextResponse.json(data, { status: 200 });
}