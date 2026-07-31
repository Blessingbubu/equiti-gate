import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TransactionFilter from "@/components/transactions/TransactionFilter";


export default async function TransactionsPage({

  searchParams,

}: {

  searchParams: Promise<{
    type?: string;
  }>;

}) {


  const {
    type
  } = await searchParams;




  const supabase =
    await createClient();





  const {
    data:{
      user
    }
  }
  =
  await supabase.auth.getUser();





  if(!user){

    redirect("/login");

  }







  let query =
    supabase
      .from("transactions")
      .select("*")
      .eq(
        "user_id",
        user.id
      );







  if(type){

    query =
      query.eq(
        "type",
        type
      );

  }








  const {
    data:transactions,
    error
  }
  =
  await query.order(

    "created_at",

    {
      ascending:false
    }

  );









  return (

    <main className="min-h-screen bg-gray-50 p-8">


      <div className="mx-auto max-w-5xl">


        <section className="rounded-xl bg-white p-8 shadow">



          <h1 className="text-3xl font-bold">

            Transaction History

          </h1>





          <p className="mt-2 text-gray-500">

            View all deposits, investments and withdrawals.

          </p>






          <TransactionFilter />









          {
            error && (

              <p className="mt-5 text-red-600">

                Unable to load transactions.

              </p>

            )

          }









          <div className="mt-8 space-y-4">





          {

            transactions &&
            transactions.length > 0


            ?


            transactions.map(

              (transaction)=>(



              <div

                key={transaction.id}

                className="flex items-center justify-between rounded-xl border p-5"

              >






                <div>


                  <h2 className="font-semibold">

                    {transaction.description}

                  </h2>




                  <p className="text-sm text-gray-500">


                    {transaction.type}


                    {" • "}


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

                      Number(transaction.amount) >= 0

                      ?

                      "text-lg font-bold text-emerald-700"

                      :

                      "text-lg font-bold text-red-600"

                    }

                  >




                    {

                      Number(transaction.amount) >= 0

                      ?

                      "+"

                      :

                      "-"

                    }




                    $




                    {

                      Math.abs(

                        Number(transaction.amount)

                      ).toFixed(2)

                    }





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

              <p className="text-gray-500">

                No transactions found.

              </p>

            )



          }





          </div>







        </section>





      </div>





    </main>

  );


}