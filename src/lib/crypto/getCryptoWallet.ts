import { createClient } from "@/lib/supabase/server";


export async function getCryptoWallet(){

  const supabase =
    await createClient();



  const {
    data,
    error
  } =
  await supabase
    .from("crypto_wallets")
    .select("*")
    .eq(
      "currency",
      "USDT"
    )
    .eq(
      "network",
      "TRC20"
    )
    .eq(
      "is_active",
      true
    )
    .single();




  if(error){

    console.log(
      "CRYPTO WALLET ERROR:",
      error
    );


    return null;

  }




  console.log(
    "CRYPTO WALLET FOUND:",
    data
  );



  return data;

}