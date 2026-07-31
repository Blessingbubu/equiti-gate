"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


export async function updateInvestmentStatus(
  investmentId: string,
  status: string
) {

  const supabase = await createClient();



  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();



  if (!user) {

    return {
      error: "Unauthorized",
    };

  }




  // Check admin role

  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        user.id
      )
      .single();



  if (
    profileError ||
    !profile ||
    profile.role !== "admin"
  ) {

    return {
      error: "Not allowed",
    };

  }




  // Get investment details

  const {
    data: investment,
    error: investmentError,
  } =
    await supabase
      .from("investments")
      .select("*")
      .eq(
        "id",
        investmentId
      )
      .single();




  if (
    investmentError ||
    !investment
  ) {

    return {
      error: "Investment not found",
    };

  }





  let updateData:any = {
    status,
  };




  // When approved calculate returns

  if (
    status === "Active"
  ) {


    const amount =
      Number(
        investment.amount
      );


    const roi =
      Number(
        investment.expected_return
          ?.replace("%","")
      ) || 0;



    const durationDays = 14;



    const profit =
      amount *
      roi /
      100;



    const dailyProfit =
      profit /
      durationDays;



    const startDate =
      new Date();



    const maturityDate =
      new Date();


    maturityDate.setDate(
      maturityDate.getDate()
      +
      durationDays
    );





    updateData = {

      ...updateData,


      start_date:
        startDate,


      maturity_date:
        maturityDate,


      duration_days:
        durationDays,


      roi_percentage:
        roi,


      daily_profit:
        dailyProfit,


      accumulated_profit:
        0,


      total_return:
        amount + profit,

    };

  }






  const {
    error,
  } =
    await supabase
      .from("investments")
      .update(
        updateData
      )
      .eq(
        "id",
        investmentId
      );





  if (error) {

    return {
      error:error.message,
    };

  }





  revalidatePath("/admin");
  revalidatePath("/dashboard");



  return {
    success:true,
  };

}