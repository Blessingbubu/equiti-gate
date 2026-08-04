import { createAdminClient } from "@/lib/supabase/admin";
import { processWeeklyProfits } from "./profitEngine";


export async function runProfitEngine() {


  const supabase =
    createAdminClient();





  const {
    data: investments,
    error

  } =
  await supabase

    .from("investments")

    .select(
      `
      id,
      user_id,
      property_name,
      status,
      next_profit_date,
      weekly_profit
      `
    )

    .eq(
      "status",
      "Active"
    );







  console.log(
    "ACTIVE INVESTMENTS FOUND:",
    investments
  );







  if(error){

    console.log(
      "ENGINE INVESTMENT FETCH ERROR:",
      error
    );

    return;

  }







  if(
    !investments ||
    investments.length === 0
  ){

    console.log(
      "NO ACTIVE INVESTMENTS FOUND"
    );

    return;

  }









  const users =

    [
      ...new Set(

        investments.map(

          (investment)=>

            investment.user_id

        )

      )
    ];







  console.log(
    "USERS TO PROCESS:",
    users
  );









  for(
    const userId of users
  ){


    console.log(
      "PROCESSING USER:",
      userId
    );



    await processWeeklyProfits(
      userId
    );


  }







  console.log(
    "GLOBAL PROFIT ENGINE COMPLETE"
  );


}