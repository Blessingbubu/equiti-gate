"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyTronTransaction } from "@/lib/crypto/tron";

export async function createDeposit(
  formData: FormData
) {

  const supabase =
    await createClient();

  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser();

  if (!user) {

    return {
      error: "Not authenticated"
    };

  }

  const amount =
    Number(
      formData.get("amount")
    );

  const payment_method =
    String(
      formData.get("payment_method")
    );

  const transaction_reference =
    String(
      formData.get("transaction_reference") || ""
    );

  let payment_provider = "";
  let payment_currency = "";
  let network = "";

  if (payment_method === "MTN Mobile Money") {

    payment_provider = "MTN Uganda";
    payment_currency = "UGX";

  }

  if (payment_method === "Airtel Money") {

    payment_provider = "Airtel Uganda";
    payment_currency = "UGX";

  }

  if (payment_method === "Crypto") {

    payment_provider = "Crypto";
    payment_currency = "USDT";
    network = "TRC20";

  }

  if (!amount || amount <= 0) {

    return {

      error: "Enter a valid amount"

    };

  }

  let verification_status = "Pending";
  let blockchain_confirmed = false;
  let blockchain_amount: number | null = null;
  let verified_at: string | null = null;

  if (payment_method === "Crypto") {

    const verification =
      await verifyTronTransaction(
        transaction_reference
      );

    if (!verification.success) {

      return {

        error:
          verification.error ??
          "Blockchain verification failed"

      };

    }

    blockchain_amount =
      verification.amount;

    blockchain_confirmed =
      verification.isCorrectWallet;

    verification_status =
      verification.isCorrectWallet
        ? "Verified"
        : "Wrong Wallet";

    if (verification.isCorrectWallet) {

      verified_at =
        new Date().toISOString();

    }

  }

  const {
    error
  } =
    await supabase
      .from("deposits")
      .insert({

        user_id: user.id,

        amount,

        payment_method,

        payment_provider,

        payment_currency,

        network,

        transaction_reference,

        status: "Pending",

        verification_status,

        blockchain_confirmed,

        blockchain_amount,

        verified_at

      });

  if (error) {

    console.error(error);

    return {

      error: error.message

    };

  }

  revalidatePath("/dashboard");
  revalidatePath("/deposit");
  revalidatePath("/admin/deposits");

  return {

    success: true

  };

}