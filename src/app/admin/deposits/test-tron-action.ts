"use server";

import { verifyTronTransaction } from "@/lib/crypto/tron";


export async function testTronTransaction(
  txHash: string
){

  const result =
    await verifyTronTransaction(
      txHash
    );


  console.log(
    "TRON TEST RESULT:",
    result
  );


  return result;

}