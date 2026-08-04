"use client";

import { useState } from "react";
import { createInvestment } from "@/app/(investor)/properties/actions";


export default function InvestmentModal({

  propertyId,
  minimumInvestment,
  propertyName,
  location,
  onClose,

}:{

  propertyId:string;
  minimumInvestment:number;
  propertyName:string;
  location:string;
  onClose:()=>void;

}){


  const [amount,setAmount] =
    useState(minimumInvestment);


  const [plan,setPlan] =
    useState("Quarterly");


  const [loading,setLoading] =
    useState(false);


  const selectedPlan =
    plan === "Quarterly"
    ?
    {
      name:"Quarterly",
      days:90,
      roi:8
    }
    :
    {
      name:"Half Year",
      days:180,
      roi:10
    };



  const monthlyProfit =
    amount *
    (selectedPlan.roi / 100);



  const weeklyProfit =
    monthlyProfit / 4;



  const totalProfit =
    monthlyProfit *
    (
      selectedPlan.days / 30
    );





  async function handleInvest(){


    setLoading(true);


    try{


      await createInvestment(

        propertyId,

        amount,

        selectedPlan.name,

        selectedPlan.days,

        selectedPlan.roi,

        monthlyProfit,

        weeklyProfit,

        totalProfit

      );


      window.location.href =
        "/dashboard";


    }catch(error:any){

      alert(
        error.message
      );

    }


    setLoading(false);

  }






  return (

    <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/60
    ">


      <div className="
        w-full
        max-w-lg
        rounded-2xl
        bg-white
        p-8
      ">


        <h2 className="text-2xl font-bold">

          Invest in {propertyName}

        </h2>


        <p className="mt-2 text-gray-500">

          {location}

        </p>





        <label className="mt-6 block font-semibold">

          Investment Amount

        </label>


        <input

          type="number"

          value={amount}

          min={minimumInvestment}

          onChange={(e)=>
            setAmount(
              Number(e.target.value)
            )
          }

          className="
          mt-2
          w-full
          rounded-lg
          border
          p-3
          "

        />





        <label className="mt-6 block font-semibold">

          Choose Plan

        </label>



        <select

          value={plan}

          onChange={(e)=>
            setPlan(
              e.target.value
            )
          }

          className="
          mt-2
          w-full
          rounded-lg
          border
          p-3
          "

        >

          <option>
            Quarterly
          </option>


          <option>
            Half Year
          </option>


        </select>





        <div className="
          mt-6
          rounded-xl
          bg-gray-100
          p-5
        ">


          <p>
            Lock Period:
            <b> {selectedPlan.days} days</b>
          </p>


          <p>
            Monthly ROI:
            <b> {selectedPlan.roi}%</b>
          </p>


          <p>
            Weekly Profit:
            <b>
              ${weeklyProfit.toFixed(2)}
            </b>
          </p>


          <p>
            Total Expected Profit:
            <b>
              ${totalProfit.toFixed(2)}
            </b>
          </p>


        </div>




        <div className="mt-8 flex gap-4">


          <button

            onClick={onClose}

            className="
            flex-1
            rounded-lg
            border
            py-3
            "

          >

            Cancel

          </button>




          <button

            disabled={loading}

            onClick={handleInvest}

            className="
            flex-1
            rounded-lg
            bg-emerald-700
            py-3
            text-white
            "

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


    </div>

  );

}