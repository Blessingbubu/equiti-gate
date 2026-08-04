import { createAdminClient } from "@/lib/supabase/admin";



export async function processWeeklyProfits(
  userId: string
) {


  const supabase =
    createAdminClient();





  const today =
    new Date();







  // Get active investments for this user

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
      "Active"
    );







  console.log(
    "USER ACTIVE INVESTMENTS:",
    investments
  );







  if(investmentError){


    console.log(
      "INVESTMENT FETCH ERROR:",
      investmentError
    );


    return;


  }







  if(
    !investments ||
    investments.length === 0
  ){


    console.log(
      "NO ACTIVE INVESTMENTS"
    );


    return;


  }









  for(
    const investment of investments
  ){



    if(
      !investment.next_profit_date
    ){

      continue;

    }







    const nextPayment =
      new Date(
        investment.next_profit_date
      );








    // Profit not due yet

    if(
      today < nextPayment
    ){


      console.log(
        "PROFIT NOT DUE:",
        investment.property_name,
        nextPayment
      );


      continue;


    }









    const profit =
      Number(
        investment.weekly_profit || 0
      );








    if(
      profit <= 0
    ){

      continue;

    }









    /*
      PREVENT DOUBLE PAYMENT
    */


    const {
      data: existingPayment

    } =
    await supabase

      .from("profit_payments")

      .select("*")

      .eq(
        "investment_id",
        investment.id
      )

      .gte(

        "payment_date",

        new Date(

          Date.now()
          -
          7 *
          24 *
          60 *
          60 *
          1000

        ).toISOString()

      )

      .maybeSingle();









    if(existingPayment){


      console.log(

        "PROFIT ALREADY PAID:",

        investment.property_name

      );


      continue;


    }









    /*
      GET WALLET
    */


    const {
      data:wallet,
      error:walletFetchError

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
      walletFetchError ||
      !wallet
    ){


      console.log(

        "WALLET FETCH ERROR:",

        walletFetchError

      );


      continue;


    }








    const newBalance =

      Number(
        wallet.balance || 0
      )
      +
      profit;









    /*
      UPDATE WALLET
    */


    const {
      error:walletUpdateError

    } =
    await supabase

      .from("wallets")

      .update({

        balance:
          newBalance,


        updated_at:
          new Date().toISOString()

      })

      .eq(
        "user_id",
        userId
      );








    if(walletUpdateError){


      console.log(

        "WALLET UPDATE ERROR:",

        walletUpdateError

      );


      continue;


    }








    console.log(

      "WALLET UPDATED:",

      wallet.balance,
      "→",
      newBalance

    );









    /*
      UPDATE INVESTMENT
    */


    await supabase

      .from("investments")

      .update({

        profit_paid:

          Number(
            investment.profit_paid || 0
          )
          +
          profit,



        accumulated_profit:

          Number(
            investment.accumulated_profit || 0
          )
          +
          profit,



        next_profit_date:

          new Date(

            Date.now()
            +
            7 *
            24 *
            60 *
            60 *
            1000

          ).toISOString()

      })

      .eq(

        "id",

        investment.id

      );









    /*
      TRANSACTION HISTORY
    */


    await supabase

      .from("transactions")

      .insert({

        user_id:

          userId,


        type:

          "profit",



        description:

          `Weekly profit from ${investment.property_name}`,



        amount:

          profit

      });









    /*
      PROFIT PAYMENT RECORD
    */


    await supabase

      .from("profit_payments")

      .insert({

        investment_id:

          investment.id,


        user_id:

          userId,


        amount:

          profit

      });








    console.log(

      "PROFIT PAYMENT COMPLETED:",

      investment.property_name

    );




  }



}