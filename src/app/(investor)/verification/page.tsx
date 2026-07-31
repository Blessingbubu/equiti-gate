import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import VerificationForm from "./VerificationForm";


export default async function VerificationPage(){


  const supabase =
    await createClient();




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
    data:profile,
  } =
  await supabase
    .from("profiles")
    .select("*")
    .eq(
      "id",
      user.id
    )
    .single();








  return (

    <main className="min-h-screen bg-gray-50 p-8">


      <div className="mx-auto max-w-2xl">





        <h1 className="text-3xl font-bold">

          Identity Verification

        </h1>




        <p className="mt-2 text-gray-500">

          Submit your details and identity document to verify your Equiti Gate account.

        </p>







        <section className="mt-8 rounded-xl bg-white p-8 shadow">



          {
            profile?.verification_status === "Verified"

            ?

            (

              <div className="rounded-lg bg-emerald-100 p-5 text-emerald-700">

                Your account is already verified.

              </div>

            )


            :


            (

              <VerificationForm

                userId={
                  user.id
                }

                country={
                  profile?.country || ""
                }

                address={
                  profile?.address || ""
                }

              />

            )

          }



        </section>




      </div>


    </main>

  );

}