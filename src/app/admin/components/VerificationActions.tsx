"use client";

import { useState } from "react";
import { updateVerificationStatus } from "../actions/verification-actions";


export default function VerificationActions({

  userId,
  currentStatus,

}:{

  userId:string;

  currentStatus:string;

}){


  const [loading,setLoading] =
    useState(false);



  async function updateStatus(

    status:"Verified" | "Rejected"

  ){


    setLoading(true);



    const result =
      await updateVerificationStatus(
        userId,
        status
      );



    console.log(result);



    setLoading(false);



    window.location.reload();


  }







  if(
    currentStatus === "Verified"
  ){

    return (

      <div className="mt-6">

        <span className="rounded-lg bg-green-100 px-4 py-2 font-semibold text-green-700">

          ✓ Investor Verified

        </span>

      </div>

    );

  }








  return (

    <div className="mt-6 flex gap-3">



      <button

        disabled={loading}

        onClick={()=>

          updateStatus("Verified")

        }

        className="rounded-lg bg-emerald-700 px-5 py-2 text-white disabled:opacity-50"

      >

        {
          loading
          ?
          "Processing..."
          :
          "Approve"
        }


      </button>







      <button

        disabled={loading}

        onClick={()=>

          updateStatus("Rejected")

        }

        className="rounded-lg bg-red-600 px-5 py-2 text-white disabled:opacity-50"

      >

        Reject

      </button>



    </div>

  );

}