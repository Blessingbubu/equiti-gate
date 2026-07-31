"use client";

import { useRouter, useSearchParams } from "next/navigation";


export default function TransactionFilter(){


  const router =
    useRouter();


  const searchParams =
    useSearchParams();



  const current =
    searchParams.get("type") || "All";



  const filters = [
    "All",
    "Deposit",
    "Investment",
    "Withdrawal"
  ];




  function changeFilter(
    type:string
  ){

    if(type === "All"){

      router.push(
        "/transactions"
      );

    }
    else{

      router.push(
        `/transactions?type=${type}`
      );

    }

  }






  return (

    <div className="mt-6 flex flex-wrap gap-3">


      {
        filters.map((filter)=>(


          <button

            key={filter}

            onClick={()=>changeFilter(filter)}

            className={

              current === filter

              ?

              "rounded-lg bg-emerald-700 px-4 py-2 text-white"

              :

              "rounded-lg border px-4 py-2"

            }

          >

            {filter}


          </button>


        ))

      }


    </div>

  );

}