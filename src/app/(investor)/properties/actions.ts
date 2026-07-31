"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function createInvestment(
  propertyId:string,
  amount:number
){


  const supabase =
    await createClient();





  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();





  if(!user){

    redirect("/login");

  }






  // Get property

  const {
    data:property
  } =
  await supabase
    .from("properties")
    .select("*")
    .eq(
      "id",
      propertyId
    )
    .single();





  if(!property){

    throw new Error(
      "Property not found"
    );

  }





  if(
    property.status !== "Active"
  ){

    throw new Error(
      "Property unavailable"
    );

  }







  if(
    amount <
    Number(
      property.minimum_investment
    )
  ){

    throw new Error(
      "Minimum investment not reached"
    );

  }






  // Get wallet

  const {
    data:wallet
  } =
  await supabase
    .from("wallets")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .single();






  if(
    !wallet ||
    Number(wallet.balance) < amount
  ){

    throw new Error(
      "Insufficient wallet balance"
    );

  }







  const roi =
    Number(
      property.expected_roi
    );



  const duration =
    14;



  const profit =
    amount *
    (roi / 100);




  const totalReturn =
    amount +
    profit;





  const dailyProfit =
    profit /
    duration;







  // Create investment

  await supabase
    .from("investments")
    .insert({

      user_id:
        user.id,


      property_name:
        property.title,


      location:
        `${property.city}, ${property.country}`,



      amount,



      investment_tier:
        "Standard",



      status:
        "Active",



      expected_return:
        `${roi}%`,



      start_date:
        new Date().toISOString(),



      maturity_date:
        new Date(
          Date.now()
          +
          duration *
          24 *
          60 *
          60 *
          1000
        ).toISOString(),



      duration_days:
        duration,



      roi_percentage:
        roi,



      daily_profit:
        dailyProfit,



      accumulated_profit:
        0,



      total_return:
        totalReturn

    });








  // Deduct wallet

  await supabase
    .from("wallets")
    .update({

      balance:
        Number(wallet.balance)
        -
        amount,


      updated_at:
        new Date().toISOString()

    })
    .eq(
      "user_id",
      user.id
    );









  // Update property funding

  await supabase
    .from("properties")
    .update({

      amount_raised:
        Number(property.amount_raised)
        +
        amount

    })
    .eq(
      "id",
      propertyId
    );








  revalidatePath("/dashboard");
  revalidatePath("/properties");


}