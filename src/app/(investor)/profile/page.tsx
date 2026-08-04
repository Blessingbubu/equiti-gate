import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function ProfilePage() {


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







  const verificationStatus =
    profile?.verification_status || "Pending";







  return (


    <main className="min-h-screen bg-gray-50 p-8">


      <div className="mx-auto max-w-3xl">





        <h1 className="text-3xl font-bold text-gray-900">

          My Profile

        </h1>




        <p className="mt-2 text-gray-500">

          Manage your Equiti Gates account information

        </p>







        <section className="mt-8 rounded-xl bg-white p-8 shadow">


          <div className="space-y-6">



            <ProfileItem
              label="Full Name"
              value={
                profile?.full_name ||
                "Not provided"
              }
            />



            <ProfileItem
              label="Email"
              value={
                user.email ||
                "Not provided"
              }
            />



            <ProfileItem
              label="Phone"
              value={
                profile?.phone ||
                "Not provided"
              }
            />



            <ProfileItem
              label="Country"
              value={
                profile?.country ||
                "Not provided"
              }
            />



            <ProfileItem
              label="Address"
              value={
                profile?.address ||
                "Not provided"
              }
            />



            <ProfileItem
              label="Account Type"
              value={
                profile?.role ||
                "Investor"
              }
            />



            <ProfileItem
              label="Member Since"
              value={
                profile?.created_at
                ?
                new Date(
                  profile.created_at
                ).toLocaleDateString()
                :
                "Unknown"
              }
            />



          </div>


        </section>









        <section className="mt-8 rounded-xl bg-white p-8 shadow">



          <h2 className="text-2xl font-bold">

            Identity Verification

          </h2>




          <p className="mt-2 text-gray-500">

            Verify your identity to unlock full investor features.

          </p>







          <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-5">



            <div>


              <p className="text-sm text-gray-500">

                Verification Status

              </p>




              <p className="mt-1 text-lg font-semibold capitalize">

                {verificationStatus}

              </p>



            </div>







            <span

              className={

                verificationStatus === "Verified"

                ?

                "rounded-full bg-emerald-100 px-4 py-2 text-emerald-700"

                :

                verificationStatus === "Rejected"

                ?

                "rounded-full bg-red-100 px-4 py-2 text-red-700"

                :

                "rounded-full bg-yellow-100 px-4 py-2 text-yellow-700"

              }

            >

              {verificationStatus}

            </span>





          </div>









          {
            verificationStatus === "Verified"

            ?

            (

              <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-emerald-700">

                Your identity has been verified. You can now access all investor features.

              </div>

            )

            :

            verificationStatus === "Rejected"

            ?

            (

              <Link

                href="/verification"

                className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 text-white"

              >

                Resubmit Verification

              </Link>

            )

            :

            (

              <Link

                href="/verification"

                className="mt-6 inline-block rounded-lg bg-emerald-700 px-6 py-3 text-white"

              >

                Complete Verification

              </Link>

            )

          }







        </section>







      </div>


    </main>


  );

}








function ProfileItem({

  label,
  value,

}:{

  label:string;

  value:string;

}){


  return (

    <div>


      <p className="text-sm text-gray-500">

        {label}

      </p>



      <p className="text-lg font-semibold">

        {value}

      </p>


    </div>

  );

}