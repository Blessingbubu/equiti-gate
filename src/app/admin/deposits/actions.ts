"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications/createNotification";


export async function updateDepositStatus(
  depositId: string,
  status: string
) {

  const supabase = await createClient();


  console.log("START APPROVAL:", depositId, status);



  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();



  if(!user){

    return {
      error:"Unauthorized"
    };

  }



  console.log("ADMIN USER:", user.id);




  const {
    data:profile,
    error:profileError
  } =
  await supabase
    .from("profiles")
    .select("role")
    .eq(
      "id",
      user.id
    )
    .single();




  console.log("PROFILE:", profile);



  if(
    profileError ||
    !profile ||
    profile.role !== "admin"
  ){

    return {
      error:"Not allowed"
    };

  }






  const {
    data:deposit,
    error:depositError
  }
  =
  await supabase
    .from("deposits")
    .select("*")
    .eq(
      "id",
      depositId
    )
    .single();




  console.log("DEPOSIT:", deposit);



  if(
    depositError ||
    !deposit
  ){

    return {
      error:"Deposit not found"
    };

  }







  if(status === "Approved"){


    console.log("APPROVAL STARTED");



    const {
      data:wallet,
      error:walletFetchError
    }
    =
    await supabase
      .from("wallets")
      .select("*")
      .eq(
        "user_id",
        deposit.user_id
      )
      .maybeSingle();




    console.log("WALLET CHECK:", wallet);
    console.log("WALLET ERROR:", walletFetchError);





    let currentBalance = 0;

    let currentDeposited = 0;





    if(wallet){


      currentBalance =
        Number(wallet.balance || 0);


      currentDeposited =
        Number(wallet.total_deposited || 0);


    }
    else{


      console.log("CREATING WALLET");



      const {
        error:createWalletError
      }
      =
      await supabase
        .from("wallets")
        .insert({

          user_id:
            deposit.user_id,

          balance:
            0,

          total_deposited:
            0

        });




      console.log(
        "CREATE WALLET ERROR:",
        createWalletError
      );




      if(createWalletError){

        return {
          error:createWalletError.message
        };

      }


    }






    let creditAmount =
      Number(deposit.amount);



    let exchangeRate = 1;





    if(
      deposit.payment_currency === "UGX"
    ){

      exchangeRate = 3700;


      creditAmount =
        Number(deposit.amount)
        /
        exchangeRate;


    }





    console.log(
      "CREDIT AMOUNT:",
      creditAmount
    );






    const newBalance =
      currentBalance +
      creditAmount;



    const newDeposited =
      currentDeposited +
      creditAmount;




    console.log(
      "NEW BALANCE:",
      newBalance
    );







    const {
      error:walletUpdateError
    }
    =
    await supabase
      .from("wallets")
      .update({

        balance:
          newBalance,

        total_deposited:
          newDeposited

      })
      .eq(
        "user_id",
        deposit.user_id
      );





    console.log(
      "WALLET UPDATE ERROR:",
      walletUpdateError
    );





    if(walletUpdateError){

      return {
        error:walletUpdateError.message
      };

    }








    const {
      error:transactionError
    }
    =
    await supabase
      .from("transactions")
      .insert({

        user_id:
          deposit.user_id,

        type:
          "Deposit",

        amount:
          creditAmount,

        description:
          "Wallet deposit approved",

        status:
          "Completed"

      });





    console.log(
      "TRANSACTION ERROR:",
      transactionError
    );






    if(transactionError){

      return {
        error:transactionError.message
      };

    }







    console.log("CREATING NOTIFICATION");



    const notificationResult =
      await createNotification({

        userId:
          deposit.user_id,

        title:
          "Deposit Approved",

        message:
          `Your deposit of ${deposit.amount} ${deposit.payment_currency || "USD"} has been approved and credited to your wallet.`,

        type:
          "deposit"

      });





    console.log(
      "NOTIFICATION RESULT:",
      notificationResult
    );





    if(!notificationResult.success){

      return {

        error:
          notificationResult.error ||
          "Notification failed"

      };

    }



  }







  const {
    error
  }
  =
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


      exchange_rate:
        status === "Approved"
        ? 3700
        : null,


      credited_amount:
        status === "Approved"
        ? Number(deposit.amount) /
          (deposit.payment_currency === "UGX" ? 3700 : 1)
        : null


    })
    .eq(
      "id",
      depositId
    );





  console.log(
    "FINAL UPDATE ERROR:",
    error
  );





  if(error){

    return {
      error:error.message
    };

  }







  revalidatePath("/admin");

  revalidatePath("/dashboard");

  revalidatePath("/notifications");





  console.log("APPROVAL COMPLETE");



  return {

    success:true

  };


}