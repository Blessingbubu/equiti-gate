import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WithdrawalForm from "./WithdrawalForm";


export default async function WithdrawPage() {


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
    error
  } =
  await supabase
    .from("wallets")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .single();





  return (

    <main className="min-h-screen bg-gray-50 p-8">


      <div className="mx-auto max-w-xl">


        <section className="rounded-xl bg-white p-8 shadow">


          <h1 className="text-3xl font-bold">

            Request Withdrawal

          </h1>



          <p className="mt-3 text-gray-600">

            Available Balance:

            {" "}

            <strong>

              ${Number(
                wallet?.balance || 0
              ).toFixed(2)}

            </strong>

          </p>




          {
            error && (

              <p className="mt-4 text-red-600">

                Unable to load wallet balance.

              </p>

            )
          }





          <WithdrawalForm

            balance={
              Number(
                wallet?.balance || 0
              )
            }

            userId={
              user.id
            }

          />



        </section>


      </div>


    </main>

  );

}