const TRON_API =
  "https://api.trongrid.io";

const USDT_CONTRACT =
  "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

type TronVerificationResult =
  | {
      success: false;
      error: string;
      raw?: any;
    }
  | {
      success: true;
      sender: string;
      receiver: string;
      amount: number;
      isCorrectWallet: boolean;
    };

export async function verifyTronTransaction(
  txHash: string
): Promise<TronVerificationResult> {

  try {

    const response =
      await fetch(
        `${TRON_API}/v1/transactions/${txHash}/events`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

    if (!response.ok) {
      return {
        success: false,
        error: "Transaction events not found",
      };
    }

    const data =
      await response.json();

    const wallet =
      process.env.TRON_WALLET_ADDRESS;

    const transfer =
      data.data?.find(
        (event: any) =>
          event.contract_address === USDT_CONTRACT
      );

    if (!transfer) {
      return {
        success: false,
        error: "No USDT TRC20 transfer found",
        raw: data,
      };
    }

    const receiver =
      transfer.result?.to;

    const sender =
      transfer.result?.from;

    const rawAmount =
      transfer.result?.value;

    const amount =
      Number(rawAmount) / 1000000;

    return {
      success: true,
      sender,
      receiver,
      amount,
      isCorrectWallet:
        receiver === wallet,
    };

  } catch (error) {

    console.error(
      "TRON VERIFY ERROR:",
      error
    );

    return {
      success: false,
      error: "Verification failed",
    };

  }

}