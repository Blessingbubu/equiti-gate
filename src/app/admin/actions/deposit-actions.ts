"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications/createNotification";


export async function updateDepositStatus(
  depositId: string,
  status: string
) {


  const supabase =
    await createClient();



  const {
    data:{
      user,
    },
  } =
  await supabase.auth.getUser();




  if(!user){

    return {
      error:"Unauthorized",
    };

  }







  const {
    data:profile,
    error:profileError,

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

    profileError ||

    !profile ||

    profile.role !== "admin"

  ){

    return {
      error:"Not allowed",
    };

  }







  const {
    data:deposit,
    error:depositError,

  } =
  await supabase

    .from("deposits")

    .select("*")

    .eq(
      "id",
      depositId
    )

    .single();






  if(

    depositError ||

    !deposit

  ){

    return {
      error:"Deposit not found",
    };

  }







  if(status === "Approved"){



    const {
      data:wallet,
      error:walletError,

    } =
    await supabase

      .from("wallets")

      .select("*")

      .eq(
        "user_id",
        deposit.user_id
      )

      .single();






    if(

      walletError ||

      !wallet

    ){

      return {
        error:"Wallet not found",
      };

    }







    const newBalance =

      Number(wallet.balance || 0)

      +

      Number(deposit.amount);







    const newDeposited =

      Number(wallet.total_deposited || 0)

      +

      Number(deposit.amount);







    const {
      error:updateWalletError,

    } =
    await supabase

      .from("wallets")

      .update({

        balance:newBalance,

        total_deposited:newDeposited,

      })

      .eq(
        "user_id",
        deposit.user_id
      );







    if(updateWalletError){

      return {
        error:updateWalletError.message,
      };

    }







    const {
      error:transactionError,

    } =
    await supabase

      .from("transactions")

      .insert({


        user_id:
          deposit.user_id,


        type:
          "Deposit",


        amount:
          deposit.amount,


        description:
          "Wallet deposit approved",


        status:
          "Completed",


      });







    if(transactionError){

      return {
        error:transactionError.message,
      };

    }







    const notificationResult =
      await createNotification({


        userId:
          deposit.user_id,


        title:
          "Deposit Approved",


        message:
          `Your deposit of ${deposit.amount} has been approved and credited to your wallet.`,


        type:
          "deposit",


      });







    if(!notificationResult.success){


      return {


        error:
          notificationResult.error ||
          "Notification creation failed"


      };


    }



  }







  const {
    error,

  } =
  await supabase

    .from("deposits")

    .update({


      status,


      approved_at:

        status === "Approved"

        ? new Date()

        : null,



      approved_by:

        user.id,


    })

    .eq(
      "id",
      depositId
    );







  if(error){

    return {

      error:error.message,

    };

  }







  revalidatePath("/admin");

  revalidatePath("/dashboard");

  revalidatePath("/notifications");







  return {

    success:true,

  };


}