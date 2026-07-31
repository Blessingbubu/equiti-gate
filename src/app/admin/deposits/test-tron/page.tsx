"use client";

import { useState } from "react";
import { testTronTransaction } from "../test-tron-action";


export default function TestTronPage(){


  const [hash,setHash] =
    useState("");

  const [result,setResult] =
    useState<any>(null);

  const [loading,setLoading] =
    useState(false);



  async function checkTransaction(){


    setLoading(true);

    setResult(null);



    const response =
      await testTronTransaction(
        hash
      );



    setResult(
      response
    );


    setLoading(false);


  }




  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">


        <h1 className="text-2xl font-bold">

          Test TRON USDT Verification

        </h1>



        <p className="mt-2 text-gray-500">

          Paste a TRON transaction hash to test blockchain verification.

        </p>





        <input

          value={hash}

          onChange={
            e =>
            setHash(e.target.value)
          }

          placeholder="TRON transaction hash"

          className="mt-5 w-full rounded-lg border p-3"

        />





        <button

          onClick={checkTransaction}

          disabled={loading}

          className="mt-4 rounded-lg bg-emerald-700 px-5 py-3 text-white"

        >

          {
            loading
            ? "Checking..."
            : "Verify Transaction"
          }


        </button>






        {
          result && (

            <pre className="mt-5 overflow-auto rounded-lg bg-gray-100 p-4 text-sm">

              {
                JSON.stringify(
                  result,
                  null,
                  2
                )
              }

            </pre>

          )
        }




      </div>


    </main>

  );


}