"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function WithdrawalForm({
  balance,
  userId,
}: {
  balance: number;
  userId: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [crypto, setCrypto] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  async function submitWithdrawal() {

    const withdrawalAmount = Number(amount);


    if (!withdrawalAmount) {
      setMessage("Enter withdrawal amount");
      return;
    }


    if (withdrawalAmount <= 0) {
      setMessage("Invalid withdrawal amount");
      return;
    }


    if (withdrawalAmount > balance) {
      setMessage("Insufficient wallet balance");
      return;
    }


    if (!crypto) {
      setMessage("Select cryptocurrency");
      return;
    }


    if (!walletAddress) {
      setMessage("Enter wallet address");
      return;
    }


    setLoading(true);
    setMessage("");



    const { error } = await supabase
      .from("withdrawals")
      .insert({

        user_id: userId,

        amount: withdrawalAmount,

        payment_method: crypto,

        account_details: walletAddress,

        status: "Pending"

      });



    if(error){

      setMessage(error.message);
      setLoading(false);
      return;

    }



    setMessage(
      "Crypto withdrawal request submitted successfully"
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

        placeholder="Withdrawal Amount (USD)"

        value={amount}

        onChange={(e)=>
          setAmount(e.target.value)
        }

        className="w-full rounded-lg border p-3"

      />



      <select

        value={crypto}

        onChange={(e)=>
          setCrypto(e.target.value)
        }

        className="w-full rounded-lg border p-3"

      >

        <option value="">
          Select Crypto Network
        </option>


        <option value="USDT TRC20">
          USDT (TRC20)
        </option>


        <option value="USDT ERC20">
          USDT (ERC20)
        </option>


        <option value="Bitcoin">
          Bitcoin (BTC)
        </option>


        <option value="Ethereum">
          Ethereum (ETH)
        </option>


      </select>





      <textarea

        placeholder="Crypto Wallet Address"

        value={walletAddress}

        onChange={(e)=>
          setWalletAddress(e.target.value)
        }

        className="w-full rounded-lg border p-3"

        rows={4}

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
          "Request Crypto Withdrawal"
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