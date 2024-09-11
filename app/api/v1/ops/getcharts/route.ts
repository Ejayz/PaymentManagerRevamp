import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    const supabase=createClient()
    const user = await supabase.auth.getUser()

// Define the start and end date for your 5-day range
const endDate = new Date();
const startDate = new Date();
startDate.setDate(endDate.getDate() - 4); // 4 days before the end date

// Convert dates to YYYY-MM-DD format
const startDateStr = startDate.toISOString().split('T')[0];
const endDateStr = endDate.toISOString().split('T')[0];


const { data, error } = await supabase
.rpc('aggregate_transactions_by_date'); 

console.log(data,error)

if (error) {
return NextResponse.json({ error: error.message }, { status: 400 });
}
return NextResponse.json(data, {
status: 200,
});


}