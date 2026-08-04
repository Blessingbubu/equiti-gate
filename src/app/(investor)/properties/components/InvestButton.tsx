"use client";

import { useState } from "react";
import InvestmentModal from "@/components/investment/InvestmentModal";


export default function InvestButton({

  propertyId,
  minimumInvestment,
  propertyName,
  location,

}:{

  propertyId:string;
  minimumInvestment:number;
  propertyName:string;
  location:string;

}){


  const [open,setOpen] =
    useState(false);



  return (

    <div className="mt-6">


      <button

        onClick={() => {

          console.log("INVEST BUTTON CLICKED");

          setOpen(true);

        }}

        className="
        rounded-lg
        bg-emerald-700
        px-6
        py-3
        font-semibold
        text-white
        hover:bg-emerald-800
        "

      >

        Invest Now


      </button>





      {
        open && (

          <InvestmentModal

            propertyId={propertyId}

            minimumInvestment={minimumInvestment}

            propertyName={propertyName}

            location={location}

            onClose={() => {

              console.log("CLOSING MODAL");

              setOpen(false);

            }}

          />

        )
      }



    </div>

  );

}