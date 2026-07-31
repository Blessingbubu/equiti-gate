import { createClient } from "@/lib/supabase/server";
import { settleCompletedInvestments } from "./settleInvestment";


export async function checkInvestmentMaturity(
  userId: string
) {

  const supabase = await createClient();



  const {
    data: investments,
    error,
  } =
  await supabase
    .from("investments")
    .select(
      "id,start_date,duration_days,status"
    )
    .eq(
      "user_id",
      userId
    )
    .eq(
      "status",
      "Active"
    );



  if(
    error ||
    !investments
  ){

    return;

  }





  const today =
    new Date();





  for(
    const investment of investments
  ){


    const maturityDate =
      new Date(
        investment.start_date
      );



    maturityDate.setDate(
      maturityDate.getDate()
      +
      Number(
        investment.duration_days || 14
      )
    );






    if(
      today >= maturityDate
    ){



      await supabase
        .from("investments")
        .update({

          status:
            "Completed"

        })
        .eq(
          "id",
          investment.id
        );



    }



  }





  // After marking completed,
  // release funds to wallet

  await settleCompletedInvestments(
    userId
  );


}