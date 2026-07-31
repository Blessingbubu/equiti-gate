import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function InvestmentsPage() {


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
    data:investments,
    error,
  } =
  await supabase
    .from("investments")
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






  const totalInvested =
    investments?.reduce(
      (sum,item)=>
        sum + Number(item.amount),
      0
    ) || 0;




  const activeInvestments =
    investments?.filter(
      item =>
        item.status === "Active"
    ).length || 0;





  const totalReturns =
    investments?.reduce(
      (sum,item)=>
        sum + Number(item.total_return || 0),
      0
    ) || 0;







  return (

    <main>



      <div className="max-w-6xl">



        <h1 className="text-3xl font-bold text-gray-900">

          My Investments

        </h1>



        <p className="mt-2 text-gray-500">

          Track your property investments, profits and maturity progress.

        </p>







        <section className="mt-8 grid gap-5 md:grid-cols-3">



          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Total Invested
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              ${totalInvested.toFixed(2)}
            </h2>

          </div>





          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Active Investments
            </p>

            <h2 className="mt-2 text-3xl font-bold text-emerald-700">
              {activeInvestments}
            </h2>

          </div>





          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Expected Returns
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              ${totalReturns.toFixed(2)}
            </h2>

          </div>



        </section>









        {
          error && (

            <div className="mt-6 rounded-lg bg-red-50 p-5 text-red-700">

              Unable to load investments.

            </div>

          )
        }








        {
          !investments ||
          investments.length === 0

          ?

          (

            <div className="mt-8 rounded-xl bg-white p-8 shadow">


              <h2 className="text-xl font-semibold">

                No Investments Yet

              </h2>



              <p className="mt-2 text-gray-500">

                Start investing in available properties.

              </p>




              <Link

                href="/properties"

                className="mt-5 inline-block rounded-lg bg-emerald-700 px-5 py-3 text-white"

              >

                Browse Properties

              </Link>


            </div>

          )


          :


          (

          <div className="mt-8 grid gap-6 md:grid-cols-2">



          {
            investments.map((investment)=>{


              const start =
                new Date(
                  investment.start_date
                );


              const maturity =
                new Date(
                  investment.maturity_date
                );



              const today =
                new Date();



              const totalDays =
                Number(
                  investment.duration_days
                );



              const passedDays =
                Math.min(
                  totalDays,
                  Math.max(
                    0,
                    Math.floor(
                      (
                        today.getTime()
                        -
                        start.getTime()
                      )
                      /
                      (1000*60*60*24)
                    )
                  )
                );



              const progress =
                Math.round(
                  (
                    passedDays /
                    totalDays
                  )
                  *
                  100
                );





              return (


              <div

                key={investment.id}

                className="rounded-xl bg-white p-6 shadow"


              >





                <div className="flex justify-between">


                  <div>

                    <h2 className="text-xl font-bold">

                      {investment.property_name}

                    </h2>


                    <p className="text-gray-500">

                      {investment.location}

                    </p>


                  </div>




                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">

                    {investment.status}

                  </span>



                </div>








                <div className="mt-6 space-y-3">



                  <p className="flex justify-between">

                    <span className="text-gray-500">
                      Investment
                    </span>

                    <b>
                      ${Number(investment.amount).toFixed(2)}
                    </b>

                  </p>





                  <p className="flex justify-between">

                    <span className="text-gray-500">
                      ROI
                    </span>

                    <b>
                      {investment.roi_percentage}%
                    </b>

                  </p>





                  <p className="flex justify-between">

                    <span className="text-gray-500">
                      Daily Profit
                    </span>

                    <b className="text-emerald-700">
                      ${Number(investment.daily_profit).toFixed(2)}
                    </b>

                  </p>





                  <p className="flex justify-between">

                    <span className="text-gray-500">
                      Total Return
                    </span>

                    <b>
                      ${Number(investment.total_return).toFixed(2)}
                    </b>

                  </p>




                  <p className="flex justify-between">

                    <span className="text-gray-500">
                      Maturity
                    </span>

                    <b>
                      {maturity.toLocaleDateString()}
                    </b>

                  </p>



                </div>








                <div className="mt-6">


                  <div className="mb-2 flex justify-between text-sm">

                    <span>
                      Progress
                    </span>

                    <span>
                      {progress}%
                    </span>


                  </div>





                  <div className="h-3 rounded-full bg-gray-200">


                    <div

                      className="h-3 rounded-full bg-emerald-600"

                      style={{
                        width:`${progress}%`
                      }}

                    />


                  </div>


                </div>





                <Link

                  href={`/investments/${investment.id}`}

                  className="mt-6 block rounded-lg bg-emerald-700 py-3 text-center text-white"

                >

                  View Details

                </Link>



              </div>


              );


            })
          }



          </div>

          )

        }



      </div>


    </main>

  );

}