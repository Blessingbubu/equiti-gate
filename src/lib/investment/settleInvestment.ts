import { createClient } from "@/lib/supabase/server";


export async function settleCompletedInvestments(
  userId: string
) {


  const supabase =
    await createClient();





  // Find completed investments not yet settled

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
    investmentError ||
    !investments ||
    investments.length === 0
  ){

    return;

  }








  // Get wallet

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



    const principal =
      Number(
        investment.amount || 0
      );



    const totalReturn =
      Number(
        investment.total_return || 0
      );



    const profit =
      totalReturn -
      principal;







    // Add full return to wallet

    newBalance =
      newBalance +
      totalReturn;



    totalProfit =
      totalProfit +
      profit;









    // Mark investment settled

    await supabase
      .from("investments")
      .update({

        settled:true

      })
      .eq(
        "id",
        investment.id
      );









    // Create principal transaction

    await supabase
      .from("transactions")
      .insert({

        user_id:userId,

        type:
          "Investment Return",


        description:
          `${investment.property_name} principal returned`,


        amount:
          principal,


        status:
          "Completed"


      });









    // Create profit transaction

    await supabase
      .from("transactions")
      .insert({

        user_id:userId,


        type:
          "Investment Profit",


        description:
          `${investment.property_name} investment profit`,


        amount:
          profit,


        status:
          "Completed"


      });






  }









  // Update wallet

  await supabase
    .from("wallets")
    .update({

      balance:
        newBalance,


      total_profit:
        totalProfit,


      updated_at:
        new Date()
        .toISOString()


    })
    .eq(
      "user_id",
      userId
    );




}