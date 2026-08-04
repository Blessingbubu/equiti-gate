import { createAdminClient } from "@/lib/supabase/admin";



export async function settleCompletedInvestments(
  userId: string
) {


  const supabase =
    createAdminClient();






  // Find completed investments not settled

  const {
    data: investments,
    error: investmentError

  } =
  await supabase

    .from("investments")

    .select("*")

    .eq(
      "user_id",
      userId
    )

    .eq(
      "status",
      "Completed"
    )

    .eq(
      "settled",
      false
    );







  if(
    investmentError
  ){

    console.log(
      "SETTLEMENT FETCH ERROR:",
      investmentError
    );

    return;

  }






  if(
    !investments ||
    investments.length === 0
  ){

    return;

  }








  const {
    data: wallet,
    error: walletError

  } =
  await supabase

    .from("wallets")

    .select("*")

    .eq(
      "user_id",
      userId
    )

    .single();







  if(
    walletError ||
    !wallet
  ){

    console.log(
      "WALLET FETCH ERROR:",
      walletError
    );

    return;

  }








  let newBalance =

    Number(
      wallet.balance || 0
    );





  let totalProfit =

    Number(
      wallet.total_profit || 0
    );









  for(
    const investment of investments
  ){



    const amount =

      Number(
        investment.amount || 0
      );



    const totalReturn =

      Number(
        investment.total_return || 0
      );



    const profit =

      totalReturn -
      amount;








    newBalance += totalReturn;


    totalProfit += profit;









    await supabase

      .from("investments")

      .update({

        settled:true

      })

      .eq(
        "id",
        investment.id
      );









    await supabase

      .from("transactions")

      .insert({

        user_id:userId,


        type:"Investment Return",


        description:
          `${investment.property_name} total return paid`,


        amount:
          totalReturn,


        status:
          "Completed"

      });









    console.log(

      "INVESTMENT SETTLED:",

      investment.property_name,

      "RETURN:",
      totalReturn

    );



  }









  await supabase

    .from("wallets")

    .update({

      balance:
        newBalance,


      total_profit:
        totalProfit,


      updated_at:
        new Date().toISOString()


    })

    .eq(
      "user_id",
      userId
    );







  console.log(

    "SETTLEMENT COMPLETE"

  );


}