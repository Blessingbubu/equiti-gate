import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import VerificationActions from "../components/VerificationActions";


export default async function VerificationPage() {


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
    data:profile
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
    !profile ||
    profile.role !== "admin"
  ){

    redirect("/dashboard");

  }







  const {
    data:investors
  } =
  await supabase
    .from("profiles")
    .select("*")
    .neq(
      "role",
      "admin"
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );







  const investorsWithDocuments =
    await Promise.all(

      (investors || []).map(
        async (investor)=>{


          let documentUrl = null;



          if(
            investor.id_document_url
          ){

            const {
              data
            } =
            await supabase
              .storage
              .from(
                "kyc-documents"
              )
              .createSignedUrl(
                investor.id_document_url,
                600
              );


            documentUrl =
              data?.signedUrl;

          }





          return {

            ...investor,

            documentUrl

          };


        }

      )

    );









  return (


    <main className="min-h-screen bg-gray-100 p-8">


      <div className="mx-auto max-w-5xl">


        <h1 className="text-3xl font-bold">

          Investor Verification

        </h1>


        <p className="mt-2 text-gray-600">

          Review investor identity documents and approve or reject verification.

        </p>







        <div className="mt-8 space-y-6">


        {
          investorsWithDocuments.map(
            (investor)=>(


              <div

                key={investor.id}

                className="rounded-xl bg-white p-6 shadow"

              >



                <div className="flex items-center justify-between">


                  <h2 className="text-xl font-bold">

                    {investor.full_name}

                  </h2>



                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">

                    {
                      investor.verification_status ||
                      "Pending"
                    }

                  </span>


                </div>







                <div className="mt-5 space-y-2 text-gray-700">


                  <p>

                    <strong>Country:</strong>
                    {" "}
                    {investor.country || "Not provided"}

                  </p>



                  <p>

                    <strong>Phone:</strong>
                    {" "}
                    {investor.phone || "Not provided"}

                  </p>




                  <p>

                    <strong>Address:</strong>
                    {" "}
                    {investor.address || "Not provided"}

                  </p>




                </div>








                {
                  investor.documentUrl && (

                    <a

                      href={
                        investor.documentUrl
                      }

                      target="_blank"

                      className="mt-6 inline-block rounded-lg bg-emerald-700 px-5 py-2 text-white hover:bg-emerald-800"

                    >

                      View Document

                    </a>

                  )
                }




                <VerificationActions

                  userId={investor.id}

                  currentStatus={
                    investor.verification_status || "Pending"
                  }

                />




              </div>


            )
          )
        }




        </div>


      </div>


    </main>


  );

}