import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function InvestmentDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {


  const { id } = await params;


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
    data:investment,
    error,
  } =
  await supabase
    .from("investments")
    .select("*")
    .eq(
      "id",
      id
    )
    .single();





  if(
    error ||
    !investment
  ){

    return (

      <main className="min-h-screen bg-gray-50 p-10">


        <div className="rounded-xl bg-white p-8 shadow">


          <h1 className="text-3xl font-bold text-red-600">

            Investment Not Found

          </h1>



          <p className="mt-5 font-semibold">

            Investment ID:

          </p>


          <pre className="mt-2 rounded bg-gray-100 p-4">

            {id}

          </pre>




          <p className="mt-5 font-semibold">

            Supabase Error:

          </p>



          <pre className="mt-2 rounded bg-gray-100 p-4">

            {JSON.stringify(
              error,
              null,
              2
            )}

          </pre>




          <Link

            href="/dashboard"

            className="mt-6 inline-block text-emerald-700"

          >

            ← Back to Dashboard

          </Link>



        </div>


      </main>

    );

  }







  let earned = 0;
  let daysPassed = 0;
  let daysRemaining = 0;




  if(
    investment.status === "Active" &&
    investment.start_date
  ){


    const startDate =
      new Date(
        investment.start_date
      );


    const today =
      new Date();



    daysPassed =
      Math.floor(
        (
          today.getTime()
          -
          startDate.getTime()
        )
        /
        (1000 * 60 * 60 * 24)
      );



    if(daysPassed < 0){

      daysPassed = 0;

    }



    earned =
      Math.min(

        daysPassed *
        Number(
          investment.daily_profit || 0
        ),


        Number(
          investment.total_return || 0
        )
        -
        Number(
          investment.amount
        )

      );





    daysRemaining =
      Math.max(

        Number(
          investment.duration_days || 0
        )
        -
        daysPassed,

        0

      );


  }







  const expectedProfit =
    Number(
      investment.total_return || 0
    )
    -
    Number(
      investment.amount || 0
    );






  const progress =
    investment.duration_days
    ?
    Math.min(

      (
        daysPassed /
        investment.duration_days
      )
      *
      100,

      100

    )
    :
    0;








  return (


    <main className="min-h-screen bg-gray-50 p-8">


      <div className="mx-auto max-w-4xl">


        <Link

          href="/dashboard"

          className="text-emerald-700"

        >

          ← Back to Dashboard

        </Link>







        <section className="mt-6 rounded-xl bg-white p-8 shadow">


          <div className="flex justify-between">


            <div>


              <h1 className="text-3xl font-bold">

                {investment.property_name}

              </h1>



              <p className="mt-2 text-gray-600">

                {investment.location}

              </p>


            </div>




            <span className="font-semibold text-emerald-700">

              ● {investment.status}

            </span>



          </div>







          <div className="mt-8 grid gap-5 md:grid-cols-2">


            <div className="rounded-lg bg-gray-50 p-5">

              <p className="text-gray-500">
                Investment Amount
              </p>

              <h2 className="text-2xl font-bold">

                ${Number(
                  investment.amount
                ).toFixed(2)}

              </h2>

            </div>





            <div className="rounded-lg bg-gray-50 p-5">

              <p className="text-gray-500">
                ROI
              </p>

              <h2 className="text-2xl font-bold">

                {investment.roi_percentage || 0}%

              </h2>

            </div>





            <div className="rounded-lg bg-gray-50 p-5">

              <p className="text-gray-500">
                Daily Earnings
              </p>

              <h2 className="text-2xl font-bold">

                ${Number(
                  investment.daily_profit || 0
                ).toFixed(2)}

              </h2>

            </div>





            <div className="rounded-lg bg-gray-50 p-5">

              <p className="text-gray-500">
                Earned So Far
              </p>

              <h2 className="text-2xl font-bold text-emerald-700">

                ${earned.toFixed(2)}

              </h2>

            </div>



          </div>







          <div className="mt-8 space-y-3 text-gray-700">


            <p>
              Start Date:
              {" "}
              {
                investment.start_date
                ?
                new Date(
                  investment.start_date
                ).toLocaleDateString()
                :
                "-"
              }
            </p>



            <p>
              Maturity Date:
              {" "}
              {
                investment.maturity_date
                ?
                new Date(
                  investment.maturity_date
                ).toLocaleDateString()
                :
                "-"
              }
            </p>



            <p>
              Days Remaining:
              {" "}
              {daysRemaining}
            </p>



            <p>
              Expected Profit:
              {" "}
              ${expectedProfit.toFixed(2)}
            </p>



            <p>
              Total Return:
              {" "}
              ${Number(
                investment.total_return || 0
              ).toFixed(2)}
            </p>



          </div>







          <div className="mt-8">


            <div className="mb-2 flex justify-between text-sm">

              <span>
                Investment Progress
              </span>


              <span>
                {progress.toFixed(0)}%
              </span>


            </div>





            <div className="h-3 rounded-full bg-gray-200">


              <div

                className="h-3 rounded-full bg-emerald-700"

                style={{
                  width:`${progress}%`
                }}

              />


            </div>



          </div>



        </section>



      </div>



    </main>


  );

}