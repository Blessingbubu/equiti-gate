"use client";

import { useState } from "react";
import { createDeposit } from "@/app/(investor)/deposit/actions";
import { QRCodeSVG } from "qrcode.react";


export default function DepositForm({

  cryptoWallet,

}: {

  cryptoWallet: any;

}) {


  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [copied, setCopied] =
    useState(false);



  async function copyAddress(){

    if(!cryptoWallet?.wallet_address)
      return;


    await navigator.clipboard.writeText(
      cryptoWallet.wallet_address
    );


    setCopied(true);


    setTimeout(() => {

      setCopied(false);

    }, 2000);

  }




  async function submit(
    e: React.FormEvent<HTMLFormElement>
  ){

    e.preventDefault();


    setLoading(true);

    setMessage("");



    const form =
      e.currentTarget;


    const formData =
      new FormData(form);



    const result =
      await createDeposit(formData);



    if(result.error){

      setMessage(
        result.error
      );


    } else {


      setMessage(
        "Crypto deposit request submitted successfully"
      );


      form.reset();


    }



    setLoading(false);

  }






  return (

    <form

      onSubmit={submit}

      className="space-y-5"

    >



      <div>

        <label className="block text-sm font-medium">

          Amount (USD)

        </label>


        <input

          name="amount"

          type="number"

          placeholder="100"

          required

          className="mt-2 w-full rounded-lg border p-3"

        />


      </div>






      <div>

        <label className="block text-sm font-medium">

          Payment Method

        </label>


        <select

          name="payment_method"

          className="mt-2 w-full rounded-lg border p-3"

        >

          <option value="Crypto">

            Crypto

          </option>


        </select>


      </div>






      <div>

        <label className="block text-sm font-medium">

          Crypto Network

        </label>



        <select

          name="network"

          className="mt-2 w-full rounded-lg border p-3"

        >

          <option value="TRC20">

            USDT TRC20

          </option>


        </select>


      </div>







      {
        cryptoWallet && (

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">


            <p className="text-sm font-semibold text-gray-700">

              Send USDT (TRC20) to this address:

            </p>




            <div className="mt-4 flex justify-center">

              <QRCodeSVG

                value={
                  cryptoWallet.wallet_address
                }

                size={180}

              />

            </div>





            <div className="mt-4 flex items-center gap-3">


              <p className="break-all text-sm font-medium text-emerald-700">

                {cryptoWallet.wallet_address}

              </p>



              <button

                type="button"

                onClick={copyAddress}

                className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white"

              >

                {
                  copied
                  ? "Copied"
                  : "Copy"
                }


              </button>


            </div>





            <p className="mt-3 text-xs text-red-600">

              Only send USDT through the TRC20 network. Other networks may result in permanent loss of funds.

            </p>



          </div>

        )
      }







      <div>


        <label className="block text-sm font-medium">

          Transaction Hash

        </label>



        <input

          name="transaction_reference"

          placeholder="Paste blockchain transaction hash"

          required

          className="mt-2 w-full rounded-lg border p-3"

        />


      </div>







      <button

        disabled={loading}

        className="w-full rounded-lg bg-emerald-700 py-3 text-white"

      >

        {

          loading

          ? "Submitting..."

          : "Submit Crypto Deposit"

        }


      </button>







      {
        message && (

          <p className="text-center text-sm text-gray-600">

            {message}

          </p>

        )
      }





    </form>

  );

}