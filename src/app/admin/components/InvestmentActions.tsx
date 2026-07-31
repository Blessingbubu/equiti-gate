"use client";

import { updateInvestmentStatus } from "../actions/investment-actions";
import { useState } from "react";

export default function InvestmentActions({
  investmentId,
}: {
  investmentId: string;
}) {

  const [loading, setLoading] = useState(false);


  async function updateStatus(status:string){

    setLoading(true);


    await updateInvestmentStatus(
      investmentId,
      status
    );


    window.location.reload();

  }



  return (

    <div className="mt-5 flex gap-3">


      <button
        disabled={loading}
        onClick={() =>
          updateStatus("Active")
        }
        className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
      >
        Approve
      </button>



      <button
        disabled={loading}
        onClick={() =>
          updateStatus("Rejected")
        }
        className="rounded-lg bg-red-600 px-5 py-2 text-white"
      >
        Reject
      </button>


    </div>

  );
}