"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


interface InvestmentFormProps {

  property: {

    id: string;
    title: string;
    city: string;
    country: string;
    minimum_investment: number;
    expected_roi: number;
    amount_raised: number;

  };

  userId: string;

}



export default function InvestmentForm({

  property,

  userId,

}: InvestmentFormProps) {


  const router = useRouter();


  const [amount,setAmount] =
    useState("");


  const [showConfirmation,setShowConfirmation] =
    useState(false);


  const [loading,setLoading] =
    useState(false);


  const [message,setMessage] =
    useState("");






  const investmentAmount =
    Number(amount) || 0;


  const expectedProfit =
    investmentAmount *
    (
      property.expected_roi / 100
    );


  const totalReturn =
    investmentAmount +
    expectedProfit;









  async function reviewInvestment(){


    if(!investmentAmount){

      setMessage(
        "Enter an investment amount"
      );

      return;

    }






    if(
      investmentAmount <
      property.minimum_investment
    ){

      setMessage(
        `Minimum investment is $${property.minimum_investment}`
      );

      return;

    }



    setMessage("");

    setShowConfirmation(true);


  }









  async function handleInvestment(){



    setLoading(true);

    setMessage("");



    const supabase =
      createClient();







    // CHECK VERIFICATION

    const {
      data:profile,
      error:profileError

    } =
    await supabase
      .from("profiles")
      .select("verification_status")
      .eq(
        "id",
        userId
      )
      .single();






    if(
      profileError ||
      !profile
    ){

      setMessage(
        "Unable to check verification status."
      );

      setLoading(false);

      return;

    }







    if(
      profile.verification_status !== "Verified"
    ){

      setMessage(
        "Please complete identity verification before investing."
      );

      setLoading(false);

      return;

    }









    const {
      data:wallet,
      error:walletError

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

      setMessage(
        "Wallet not found"
      );

      setLoading(false);

      return;

    }







    if(
      Number(wallet.balance)
      <
      investmentAmount
    ){

      setMessage(
        "Insufficient wallet balance"
      );

      setLoading(false);

      return;

    }







    const oldBalance =
      Number(wallet.balance);



    const newBalance =
      oldBalance -
      investmentAmount;







    const {
      error:walletUpdateError

    } =
    await supabase
      .from("wallets")
      .update({

        balance:
          newBalance,


        updated_at:
          new Date(),

      })
      .eq(
        "user_id",
        userId
      );







    if(walletUpdateError){

      setMessage(
        walletUpdateError.message
      );

      setLoading(false);

      return;

    }







    const durationDays =
      14;



    const startDate =
      new Date();



    const maturityDate =
      new Date();



    maturityDate.setDate(
      maturityDate.getDate()
      +
      durationDays
    );








    const {
      error:investmentError

    } =
    await supabase
      .from("investments")
      .insert({

        user_id:
          userId,


        property_name:
          property.title,


        location:
          `${property.city}, ${property.country}`,


        amount:
          investmentAmount,


        investment_tier:
          "Standard",


        status:
          "Active",


        expected_return:
          `${property.expected_roi}%`,


        start_date:
          startDate,


        maturity_date:
          maturityDate,


        duration_days:
          durationDays,


        roi_percentage:
          property.expected_roi,


        daily_profit:
          expectedProfit / durationDays,


        accumulated_profit:
          0,


        total_return:
          totalReturn

      });








    if(investmentError){


      await supabase
        .from("wallets")
        .update({

          balance:
            oldBalance,

          updated_at:
            new Date(),

        })
        .eq(
          "user_id",
          userId
        );



      setMessage(
        investmentError.message
      );


      setLoading(false);

      return;

    }








    await supabase
      .from("transactions")
      .insert({

        user_id:
          userId,


        type:
          "Investment",


        description:
          `Investment in ${property.title}`,


        amount:
          investmentAmount * -1,


        status:
          "Completed"

      });








    const {
      error:propertyUpdateError

    } =
    await supabase.rpc(
      "increase_property_amount",
      {

        property_id:
          property.id,


        investment_amount:
          investmentAmount,

      }
    );







    if(propertyUpdateError){

      setMessage(
        propertyUpdateError.message
      );

      setLoading(false);

      return;

    }







    setMessage(
      "Investment activated successfully."
    );


    setLoading(false);




    setTimeout(()=>{

      router.push("/dashboard");

      router.refresh();


    },1500);



  }









  return (


    <div className="mt-6">





      {
        !showConfirmation && (

          <>

          <label className="block text-sm font-medium">

            Investment Amount ($)

          </label>




          <input

            type="number"

            value={amount}

            onChange={(e)=>
              setAmount(e.target.value)
            }

            placeholder={
              String(property.minimum_investment)
            }

            className="mt-2 w-full rounded-lg border p-3"

          />





          <button

            onClick={reviewInvestment}

            className="mt-5 w-full rounded-lg bg-emerald-700 py-3 text-white"

          >

            Review Investment

          </button>


          </>

        )
      }









      {
        showConfirmation && (

          <div className="rounded-xl bg-gray-50 p-6 shadow">


            <h2 className="text-xl font-bold">

              Confirm Investment

            </h2>




            <div className="mt-5 space-y-3">


              <p>
                <strong>Property:</strong> {property.title}
              </p>


              <p>
                <strong>Location:</strong> {property.city}, {property.country}
              </p>


              <p>
                <strong>Amount:</strong> ${investmentAmount}
              </p>


              <p>
                <strong>Expected ROI:</strong> {property.expected_roi}%
              </p>


              <p>
                <strong>Duration:</strong> 14 days
              </p>


              <p>
                <strong>Expected Profit:</strong> ${expectedProfit.toFixed(2)}
              </p>


              <p>
                <strong>Total Return:</strong> ${totalReturn.toFixed(2)}
              </p>


            </div>





            <div className="mt-6 flex gap-3">


              <button

                onClick={() =>
                  setShowConfirmation(false)
                }

                className="flex-1 rounded-lg border py-3"

              >

                Cancel

              </button>





              <button

                onClick={handleInvestment}

                disabled={loading}

                className="flex-1 rounded-lg bg-emerald-700 py-3 text-white"

              >

                {
                  loading
                  ?
                  "Processing..."
                  :
                  "Confirm Investment"
                }


              </button>



            </div>



          </div>

        )
      }









      {
        message && (

          <p className="mt-4 text-center text-sm text-gray-700">

            {message}

          </p>

        )
      }




    </div>


  );

}