"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


export async function updateWithdrawalStatus(
  withdrawalId: string,
  status: string
) {


  const supabase = await createClient();



  const {
    data:{
      user,
    },
  } =
  await supabase.auth.getUser();




  if(!user){

    return {
      error:"Unauthorized"
    };

  }





  const {
    data:profile
  } =
  await supabase
    .from("profiles")
    .select("role")
    .eq(
      "id",
      user.id
    )
    .single();





  if(
    !profile ||
    profile.role !== "admin"
  ){

    return {
      error:"Not allowed"
    };

  }







  const {
    data:withdrawal,
    error:withdrawalError
  } =
  await supabase
    .from("withdrawals")
    .select("*")
    .eq(
      "id",
      withdrawalId
    )
    .single();






  if(
    withdrawalError ||
    !withdrawal
  ){

    return {
      error:"Withdrawal not found"
    };

  }







  if(status === "Approved"){



    const {
      data:wallet
    } =
    await supabase
      .from("wallets")
      .select("*")
      .eq(
        "user_id",
        withdrawal.user_id
      )
      .single();





    if(!wallet){

      return {
        error:"Wallet not found"
      };

    }





    if(
      Number(wallet.balance)
      <
      Number(withdrawal.amount)
    ){

      return {
        error:"Insufficient wallet balance"
      };

    }








    await supabase
      .from("wallets")
      .update({

        balance:
          Number(wallet.balance)
          -
          Number(withdrawal.amount),



        total_withdrawn:
          Number(wallet.total_withdrawn || 0)
          +
          Number(withdrawal.amount)

      })
      .eq(
        "user_id",
        withdrawal.user_id
      );








    await supabase
      .from("transactions")
      .insert({

        user_id:
          withdrawal.user_id,


        type:
          "Withdrawal",


        amount:
          withdrawal.amount,


        description:
          "Wallet withdrawal approved",


        status:
          "Completed"

      });



  }








  const {
    error
  } =
  await supabase
    .from("withdrawals")
    .update({

      status,


      approved_at:
        status === "Approved"
        ?
        new Date()
        :
        null,


      approved_by:
        user.id

    })
    .eq(
      "id",
      withdrawalId
    );






  if(error){

    return {
      error:error.message
    };

  }






  revalidatePath("/admin/withdrawals");
  revalidatePath("/wallet");
  revalidatePath("/dashboard");




  return {
    success:true
  };


}