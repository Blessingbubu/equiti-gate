import { createAdminClient } from "@/lib/supabase/admin";
import { settleCompletedInvestments } from "./settleInvestment";



export async function checkInvestmentMaturity(
  userId: string
) {


  const supabase =
    createAdminClient();




  console.log(
    "CHECKING MATURITY FOR USER:",
    userId
  );





  const {
    data: investments,
    error

  } =
  await supabase

    .from("investments")

    .select(
      `
      id,
      property_name,
      maturity_date,
      status,
      settled
      `
    )

    .eq(
      "user_id",
      userId
    )

    .eq(
      "status",
      "Active"
    )

    .eq(
      "settled",
      false
    );







  if(error){


    console.log(
      "MATURITY FETCH ERROR:",
      error
    );


    return;

  }







  console.log(
    "ACTIVE INVESTMENTS FOR MATURITY:",
    investments
  );







  if(
    !investments ||
    investments.length === 0
  ){


    console.log(
      "NO ACTIVE INVESTMENTS TO CHECK"
    );


    return;

  }








  const today =
    new Date();







  for(
    const investment of investments
  ){



    const maturityDate =
      new Date(
        investment.maturity_date
      );





    console.log(
      "CHECKING:",
      investment.property_name,
      "MATURITY:",
      maturityDate,
      "TODAY:",
      today
    );







    if(
      today >= maturityDate
    ){



      console.log(
        "MATURITY REACHED:",
        investment.property_name
      );






      const {
        error:updateError
      } =

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






      if(updateError){


        console.log(
          "MATURITY UPDATE ERROR:",
          updateError
        );


      }
      else{


        console.log(
          "MARKED COMPLETED:",
          investment.property_name
        );


      }



    }

    else{


      console.log(
        "NOT MATURE:",
        investment.property_name
      );


    }




  }








  await settleCompletedInvestments(
    userId
  );




}