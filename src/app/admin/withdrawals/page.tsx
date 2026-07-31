import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateWithdrawalStatus } from "./actions";


export default async function AdminWithdrawalsPage() {


  const supabase = await createClient();



  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();



  if (!user) {

    redirect("/login");

  }





  const {
    data: profile
  } =
  await supabase
    .from("profiles")
    .select("role")
    .eq(
      "id",
      user.id
    )
    .single();





  if (
    !profile ||
    profile.role !== "admin"
  ) {

    redirect("/dashboard");

  }






  const {
    data: withdrawals,
    error
  } =
  await supabase
    .from("withdrawals")
    .select("*")
    .order(
      "created_at",
      {
        ascending: false
      }
    );





  const userIds =
    withdrawals?.map(
      withdrawal =>
        withdrawal.user_id
    ) || [];





  const {
    data: profiles
  } =
  await supabase
    .from("profiles")
    .select(
      "id, full_name, email"
    )
    .in(
      "id",
      userIds
    );






  if (error) {


    return (

      <div className="rounded-xl bg-white p-8 shadow">

        <h1 className="text-2xl font-bold text-red-600">

          Error Loading Withdrawals

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

          Withdrawal Requests

        </h1>



        <p className="mt-2 text-gray-500">

          Review and manage investor withdrawal requests.

        </p>






        <div className="mt-8 space-y-5">



        {
          withdrawals &&
          withdrawals.length > 0

          ?

          withdrawals.map(
            (withdrawal) => {


              const investor =
                profiles?.find(
                  profile =>
                    profile.id === withdrawal.user_id
                );



              return (


              <div

                key={withdrawal.id}

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

                      {
                        investor?.email ||
                        "-"
                      }

                    </p>


                  </div>





                  <span

                    className={

                      withdrawal.status === "Pending"

                      ?

                      "font-semibold text-orange-600"

                      :

                      withdrawal.status === "Approved"

                      ?

                      "font-semibold text-emerald-700"

                      :

                      "font-semibold text-red-600"

                    }

                  >

                    {withdrawal.status}

                  </span>



                </div>









                <div className="mt-5 space-y-2 text-gray-700">


                  <p>

                    Amount:

                    {" "}

                    <strong>

                    ${Number(
                      withdrawal.amount
                    ).toFixed(2)}

                    </strong>

                  </p>





                  <p>

                    Payment Method:

                    {" "}

                    {withdrawal.payment_method}

                  </p>





                  <p>

                    Account Details:

                    {" "}

                    {withdrawal.account_details}

                  </p>





                  <p>

                    Requested:

                    {" "}

                    {
                      new Date(
                        withdrawal.created_at
                      ).toLocaleDateString()
                    }

                  </p>



                </div>








                {
                  withdrawal.status === "Pending" && (


                    <div className="mt-6 flex gap-4">


                      <form

                        action={
                          async () => {

                            "use server";


                            await updateWithdrawalStatus(
                              withdrawal.id,
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
                          async () => {

                            "use server";


                            await updateWithdrawalStatus(
                              withdrawal.id,
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

              No withdrawal requests found.

            </div>

          )


        }



        </div>



      </div>



    </main>


  );


}