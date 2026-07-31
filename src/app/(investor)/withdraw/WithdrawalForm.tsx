"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";


export default function WithdrawalForm({

  balance,
  userId

}:{

  balance:number;
  userId:string;

}){


  const supabase = createClient();

  const router = useRouter();


  const [amount,setAmount] =
    useState("");

  const [method,setMethod] =
    useState("");

  const [details,setDetails] =
    useState("");

  const [message,setMessage] =
    useState("");

  const [loading,setLoading] =
    useState(false);





  async function submitWithdrawal(){


    const withdrawalAmount =
      Number(amount);




    if(!withdrawalAmount){

      setMessage(
        "Enter withdrawal amount"
      );

      return;

    }





    if(withdrawalAmount <= 0){

      setMessage(
        "Invalid withdrawal amount"
      );

      return;

    }





    if(withdrawalAmount > balance){

      setMessage(
        "Insufficient wallet balance"
      );

      return;

    }





    if(!method){

      setMessage(
        "Enter payment method"
      );

      return;

    }





    if(!details){

      setMessage(
        "Enter account details"
      );

      return;

    }





    setLoading(true);

    setMessage("");





    const {
      error
    } =
    await supabase
      .from("withdrawals")
      .insert({

        user_id:
          userId,

        amount:
          withdrawalAmount,

        payment_method:
          method,

        account_details:
          details,

        status:
          "Pending"

      });







    if(error){

      setMessage(
        error.message
      );

      setLoading(false);

      return;

    }





    setMessage(
      "Withdrawal request submitted successfully"
    );





    setTimeout(()=>{

      router.push("/wallet");

      router.refresh();

    },1500);



  }





  return (

    <div className="mt-6 space-y-4">





      <input

        type="number"

        placeholder="Withdrawal Amount"

        value={amount}

        onChange={(e)=>
          setAmount(e.target.value)
        }

        className="w-full rounded-lg border p-3"

      />







      <input

        placeholder="Payment Method (e.g Mobile Money)"

        value={method}

        onChange={(e)=>
          setMethod(e.target.value)
        }

        className="w-full rounded-lg border p-3"

      />







      <textarea

        placeholder="Account details"

        value={details}

        onChange={(e)=>
          setDetails(e.target.value)
        }

        className="w-full rounded-lg border p-3"

      />








      <button

        disabled={loading}

        onClick={submitWithdrawal}

        className="w-full rounded-lg bg-emerald-700 py-3 text-white disabled:opacity-50"

      >

        {
          loading
          ?
          "Submitting..."
          :
          "Request Withdrawal"
        }


      </button>







      {
        message && (

          <p className="text-center text-gray-700">

            {message}

          </p>

        )
      }





    </div>

  );

}