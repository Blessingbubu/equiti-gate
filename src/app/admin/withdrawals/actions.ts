"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";


export async function updateWithdrawalStatus(
  id: string,
  status: string
) {

  const supabase = await createClient();
const {
  data: {
    user: currentUser
  }
} = await supabase.auth.getUser();


console.log(
  "ADMIN SESSION USER:",
  currentUser?.id
);

  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();



  if(!user){

    throw new Error(
      "Unauthorized"
    );

  }





  // Get withdrawal request

  const {
    data: withdrawal,
    error: withdrawalError
  } =
  await supabase
    .from("withdrawals")
    .select("*")
    .eq(
      "id",
      id
    )
    .single();





  if(
    withdrawalError ||
    !withdrawal
  ){

    throw new Error(
      "Withdrawal not found"
    );

  }






  // Prevent double processing

  if(
    withdrawal.status !== "Pending"
  ){

    throw new Error(
      "Withdrawal already processed"
    );

  }







  if(status === "Approved"){



    // Get wallet

    const {
      data: wallet,
      error: walletError
    }
    =
    await supabase
      .from("wallets")
      .select("*")
      .eq(
        "user_id",
        withdrawal.user_id
      )
      .single();





    if(
      walletError ||
      !wallet
    ){

      throw new Error(
        "Wallet not found"
      );

    }






    const currentBalance =
      Number(wallet.balance);



    const withdrawalAmount =
      Number(withdrawal.amount);





    if(
      currentBalance <
      withdrawalAmount
    ){

      throw new Error(
        "Insufficient wallet balance"
      );

    }







    const newBalance =
      currentBalance -
      withdrawalAmount;






    // Update wallet

    const {
      error: walletUpdateError
    }
    =
    await supabase
      .from("wallets")
      .update({

        balance:
          newBalance,


        total_withdrawn:
          Number(
            wallet.total_withdrawn || 0
          )
          +
          withdrawalAmount,


        updated_at:
          new Date()

      })
      .eq(
        "user_id",
        withdrawal.user_id
      );







    if(walletUpdateError){

      throw new Error(
        walletUpdateError.message
      );

    }









    // Create transaction record

    const adminSupabase =
  createAdminClient();



const {
  data: transactionData,
  error: transactionError
}
=
await adminSupabase
  .from("transactions")
  .insert({

    user_id:
      withdrawal.user_id,


    type:
      "Withdrawal",


    description:
      `Withdrawal approved - ${withdrawal.payment_method}`,


    amount:
      Number(withdrawal.amount) * -1,


    status:
      "Completed"

  })
  .select();





    console.log(
      "TRANSACTION RESULT:",
      transactionData,
      transactionError
    );






    if(transactionError){

      throw new Error(
        transactionError.message
      );

    }





  }







  // Update withdrawal status


  const {
    error:updateError
  }
  =
  await supabase
    .from("withdrawals")
    .update({

      status,


      approved_at:
        status === "Approved"
        ?
        new Date().toISOString()
        :
        null,


      approved_by:
        status === "Approved"
        ?
        user.id
        :
        null


    })
    .eq(
      "id",
      id
    );







  if(updateError){

    throw new Error(
      updateError.message
    );

  }







  revalidatePath(
    "/admin/withdraws"
  );


}