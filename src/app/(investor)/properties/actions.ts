"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function createInvestment(

  propertyId:string,

  amount:number,

  investmentPlan:string,

  lockPeriodDays:number,

  monthlyRoi:number,

  monthlyProfit:number,

  weeklyProfit:number,

  totalExpectedProfit:number

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
    data:property,
    error:propertyError

  } =
  await supabase

    .from("properties")

    .select("*")

    .eq(
      "id",
      propertyId
    )

    .single();





  if(propertyError || !property){

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
    Number(property.minimum_investment)
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







  const startDate =
    new Date();




  const maturityDate =
    new Date(
      Date.now()
      +
      lockPeriodDays *
      24 *
      60 *
      60 *
      1000
    );







  // Create investment

  const {
    error:investmentError

  } =
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
        investmentPlan,



      investment_plan:
        investmentPlan,



      status:
        "Active",



      expected_return:
        `${monthlyRoi}% monthly`,



      start_date:
        startDate.toISOString(),



      maturity_date:
        maturityDate.toISOString(),



      duration_days:
        lockPeriodDays,



      roi_percentage:
        monthlyRoi,



      monthly_roi:
        monthlyRoi,



      monthly_profit:
        monthlyProfit,



      weekly_profit:
        weeklyProfit,



      total_expected_profit:
        totalExpectedProfit,



      total_return:
        amount +
        totalExpectedProfit,



      accumulated_profit:
        0,



      profit_paid:
        0,



      next_profit_date:
        new Date(

          Date.now()
          +
          7 *
          24 *
          60 *
          60 *
          1000

        ).toISOString(),



      settled:
        false,



      principal_status:
        "Locked"


    });







  if(investmentError){

    throw new Error(
      investmentError.message
    );

  }







  // Deduct wallet balance


  const {
    error:walletError

  } =
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







  if(walletError){

    throw new Error(
      walletError.message
    );

  }







  // Update property funding


  const {
    error:propertyUpdateError

  } =
  await supabase

    .from("properties")

    .update({

      amount_raised:
        Number(property.amount_raised || 0)
        +
        amount

    })

    .eq(
      "id",
      propertyId
    );







  if(propertyUpdateError){

    throw new Error(
      propertyUpdateError.message
    );

  }







  revalidatePath("/dashboard");

  revalidatePath("/properties");

}