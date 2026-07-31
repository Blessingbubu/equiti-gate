import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function WalletPage() {


  const supabase = await createClient();



  const {
    data:{
      user,
    },
  } =
  await supabase.auth.getUser();



  if(!user){

    redirect("/login");

  }





  const {
    data:wallet,
  } =
  await supabase
    .from("wallets")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .single();






  const {
    data:transactions,
  } =
  await supabase
    .from("transactions")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );







  return (


    <main className="min-h-screen bg-gray-50 p-8">


      <div className="mx-auto max-w-5xl">


        <Link

          href="/dashboard"

          className="text-emerald-700"

        >

          ← Back to Dashboard

        </Link>







        <h1 className="mt-6 text-4xl font-bold">

          My Wallet

        </h1>







        <section className="mt-8 grid gap-6 md:grid-cols-4">



          <div className="rounded-xl bg-white p-6 shadow">


            <p className="text-gray-500">
              Available Balance
            </p>


            <h2 className="mt-3 text-3xl font-bold">

              ${Number(
                wallet?.balance || 0
              ).toFixed(2)}

            </h2>


          </div>





          <div className="rounded-xl bg-white p-6 shadow">


            <p className="text-gray-500">
              Total Deposited
            </p>


            <h2 className="mt-3 text-3xl font-bold">

              ${Number(
                wallet?.total_deposited || 0
              ).toFixed(2)}

            </h2>


          </div>







          <div className="rounded-xl bg-white p-6 shadow">


            <p className="text-gray-500">
              Total Withdrawn
            </p>


            <h2 className="mt-3 text-3xl font-bold">

              ${Number(
                wallet?.total_withdrawn || 0
              ).toFixed(2)}

            </h2>


          </div>





          <div className="rounded-xl bg-white p-6 shadow">


            <p className="text-gray-500">
              Transactions
            </p>


            <h2 className="mt-3 text-3xl font-bold">

              {transactions?.length || 0}

            </h2>


          </div>





        </section>









        <section className="mt-10 rounded-xl bg-white p-8 shadow">


          <h2 className="text-2xl font-bold">

            Transaction History

          </h2>






          <div className="mt-6 space-y-4">



          {
            transactions &&
            transactions.length > 0
            ?

            transactions.map(
              (transaction)=>(


                <div

                  key={transaction.id}

                  className="flex items-center justify-between rounded-lg border p-5"

                >



                  <div>


                    <h3 className="font-bold">

                      {transaction.type}

                    </h3>



                    <p className="text-gray-600">

                      {transaction.description}

                    </p>



                    <p className="text-sm text-gray-500">

                      {
                        new Date(
                          transaction.created_at
                        ).toLocaleDateString()
                      }

                    </p>


                  </div>






                  <div className="text-right">


                    <p

                      className={
                        transaction.type === "Deposit"
                        ?
                        "text-emerald-700 font-bold"
                        :
                        "text-red-600 font-bold"
                      }

                    >

                      {
                        transaction.type === "Deposit"
                        ? "+"
                        : "-"
                      }

                      ${Number(
                        transaction.amount
                      ).toFixed(2)}

                    </p>




                    <p className="text-sm text-gray-500">

                      {transaction.status}

                    </p>


                  </div>




                </div>


              )

            )


            :

            (

              <p className="text-gray-600">

                No transactions yet.

              </p>

            )

          }



          </div>



        </section>






      </div>



    </main>


  );

}