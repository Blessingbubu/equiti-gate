"use client";

import { updateDepositStatus } from "../actions/deposit-actions";
import { useState } from "react";


export default function DepositActions({
  id,
}: {
  id: string;
}) {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  async function update(status: string) {

    setLoading(true);
    setMessage("");



    const result = await updateDepositStatus(
      id,
      status
    );



    if (result?.error) {

      setMessage(
        result.error
      );

      setLoading(false);

      return;

    }



    setMessage(
      "Updated successfully"
    );



    setTimeout(() => {

      window.location.reload();

    }, 1000);


  }



  return (

    <div className="mt-5">


      <div className="flex gap-3">


        <button
          disabled={loading}
          onClick={() =>
            update("Approved")
          }
          className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
        >
          {
            loading
            ? "Processing..."
            : "Approve"
          }
        </button>



        <button
          disabled={loading}
          onClick={() =>
            update("Rejected")
          }
          className="rounded-lg bg-red-600 px-5 py-2 text-white"
        >
          Reject
        </button>


      </div>



      {
        message && (

          <p className="mt-3 text-sm text-red-600">
            {message}
          </p>

        )
      }



    </div>

  );

}