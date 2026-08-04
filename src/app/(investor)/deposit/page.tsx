import { createClient } from "@/lib/supabase/server";
import DepositForm from "@/components/wallet/DepositForm";
import { getCryptoWallet } from "@/lib/crypto/getCryptoWallet";


export default async function DepositPage(){

  const supabase =
    await createClient();


  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();



  if(!user){

    return (

      <div className="p-6">
        Please login.
      </div>

    );

  }



  const cryptoWallet =
    await getCryptoWallet();



  return (

    <main className="min-h-screen bg-gray-50 p-8">

      <div className="mx-auto max-w-3xl">


        <h1 className="text-3xl font-bold text-emerald-700">
          Crypto Deposit
        </h1>


        <p className="mt-2 text-gray-500">
          Deposit USDT to your Equiti Gates wallet.
        </p>


        <div className="mt-8 rounded-xl bg-white p-6 shadow">

          <DepositForm
            cryptoWallet={cryptoWallet}
          />

        </div>


      </div>

    </main>

  );

}