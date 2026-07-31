import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateDepositStatus } from "./actions";


export default async function AdminDepositsPage() {


  const supabase =
    await createClient();



  const {
    data:{
      user
    }

  } =
  await supabase.auth.getUser();



  if(!user){

    redirect("/login");

  }




  const {
    data:adminProfile
  } =
  await supabase
    .from("profiles")
    .select("role")
    .eq(
      "id",
      user.id
    )
    .single();





  if(
    !adminProfile ||
    adminProfile.role !== "admin"
  ){

    redirect("/dashboard");

  }







  const {
    data:deposits,
    error
  } =
  await supabase
    .from("deposits")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false
      }
    );







  const userIds =
    deposits?.map(
      deposit =>
        deposit.user_id
    ) || [];







  const {
    data:profiles
  } =
  await supabase
    .from("profiles")
    .select(
      "id, full_name"
    )
    .in(
      "id",
      userIds
    );







  if(error){

    return (

      <div className="rounded-xl bg-white p-8 shadow">

        <h1 className="text-2xl font-bold text-red-600">

          Error Loading Deposits

        </h1>


        <pre className="mt-4 rounded bg-gray-100 p-4">

          {JSON.stringify(
            error,
            null,
            2
          )}

        </pre>


      </div>

    );

  }







  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="mx-auto max-w-6xl">


        <h1 className="text-3xl font-bold">

          Deposit Requests

        </h1>



        <p className="mt-2 text-gray-500">

          Review investor deposit requests.

        </p>







        <div className="mt-8 space-y-5">


        {
          deposits &&
          deposits.length > 0

          ?

          deposits.map(

            (deposit)=>{


              const investor =
                profiles?.find(

                  profile =>
                    profile.id === deposit.user_id

                );



              return (

              <div

                key={deposit.id}

                className="rounded-xl bg-white p-6 shadow"

              >





                <div className="flex justify-between">


                  <div>


                    <h2 className="text-xl font-bold">

                      {
                        investor?.full_name ||
                        "Investor"
                      }

                    </h2>



                    <p className="text-gray-500">

                      Investor ID:

                      {" "}

                      {deposit.user_id}

                    </p>


                  </div>






                  <span

                    className={

                      deposit.status === "Pending"

                      ?

                      "font-semibold text-orange-600"

                      :

                      deposit.status === "Approved"

                      ?

                      "font-semibold text-emerald-700"

                      :

                      "font-semibold text-red-600"

                    }

                  >

                    {deposit.status}

                  </span>



                </div>









                <div className="mt-5 space-y-2 text-gray-700">





                  <p>

                    Amount:

                    {" "}

                    <strong>

                    ${Number(
                      deposit.amount
                    ).toFixed(2)}

                    </strong>

                  </p>







                  <p>

                    Payment Method:

                    {" "}

                    {deposit.payment_method}

                  </p>







                  {
                    deposit.payment_method === "Crypto" && (

                      <>


                        <p>

                          Currency:

                          {" "}

                          <strong>

                            {deposit.payment_currency || "USDT"}

                          </strong>

                        </p>





                        <p>

                          Network:

                          {" "}

                          <strong>

                            {deposit.network || "TRC20"}

                          </strong>

                        </p>



                      </>

                    )
                  }







                  <p>

                    Transaction Reference:

                    {" "}

                    {deposit.transaction_reference || "N/A"}

                  </p>







                  {
                    deposit.payment_method === "Crypto" &&
                    deposit.transaction_reference && (

                      <p>

                        Blockchain:

                        {" "}

                        <a

                          href={
                            `https://tronscan.org/#/transaction/${deposit.transaction_reference}`
                          }

                          target="_blank"

                          className="text-emerald-700 underline"

                        >

                          Verify Transaction

                        </a>


                      </p>


                    )

                  }







                  {
                    deposit.proof_url && (

                      <p>

                        Proof:

                        {" "}

                        <a

                          href={deposit.proof_url}

                          target="_blank"

                          className="text-emerald-700 underline"

                        >

                          View Proof

                        </a>


                      </p>

                    )
                  }







                  <p>

                    Requested:

                    {" "}

                    {
                      new Date(
                        deposit.created_at
                      ).toLocaleDateString()
                    }

                  </p>



                </div>









                {
                  deposit.status === "Pending" && (


                    <div className="mt-6 flex gap-4">





                      <form

                        action={

                          async()=>{

                            "use server";


                            await updateDepositStatus(

                              deposit.id,

                              "Approved"

                            );


                          }

                        }

                      >


                        <button

                          className="rounded-lg bg-emerald-700 px-5 py-2 text-white"

                        >

                          Approve

                        </button>


                      </form>







                      <form

                        action={

                          async()=>{

                            "use server";


                            await updateDepositStatus(

                              deposit.id,

                              "Rejected"

                            );


                          }

                        }

                      >


                        <button

                          className="rounded-lg bg-red-600 px-5 py-2 text-white"

                        >

                          Reject

                        </button>


                      </form>





                    </div>


                  )
                }





              </div>


              );


            }

          )


          :

          (

            <div className="rounded-xl bg-white p-6 text-center shadow">

              No deposit requests found.

            </div>

          )


        }





        </div>



      </div>


    </main>

  );


}