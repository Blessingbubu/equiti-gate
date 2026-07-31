"use client";

import { useState } from "react";
import { createInvestment } from "../../(investor)/properties/actions";


export default function InvestButton({

  propertyId,
  minimumInvestment,

}:{

  propertyId:string;
  minimumInvestment:number;

}){


  const [loading,setLoading] =
    useState(false);


  const [error,setError] =
    useState("");





  async function handleInvest(){


    setLoading(true);
    setError("");



    try{


      await createInvestment(

        propertyId,

        minimumInvestment

      );



      window.location.href =
        "/dashboard";



    }catch(err:any){


      setError(
        err.message ||
        "Investment failed"
      );


    }


    setLoading(false);


  }








  return (

    <div className="mt-6">


      {
        error && (

          <p className="mb-3 text-red-600">

            {error}

          </p>

        )
      }






      <button


        onClick={handleInvest}


        disabled={loading}


        className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white disabled:opacity-50"


      >

        {
          loading
          ?
          "Processing..."
          :
          "Invest Now"
        }


      </button>



    </div>

  );


}