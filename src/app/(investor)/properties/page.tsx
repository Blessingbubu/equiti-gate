import { createClient } from "@/lib/supabase/server";
import Link from "next/link";


export default async function PropertiesPage() {


  const supabase = await createClient();



  const {
    data: properties,
    error,
  } = await supabase
    .from("properties")
    .select("*")
    .eq(
      "status",
      "Active"
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );





  if(error){

    return (

      <main className="min-h-screen bg-gray-50 p-8">

        <h1 className="text-2xl font-bold text-red-600">
          Error loading properties
        </h1>


        <p className="mt-2 text-gray-600">
          {error.message}
        </p>


      </main>

    );

  }






  return (

    <main className="min-h-screen bg-gray-50 px-8 py-10">





      <section className="rounded-xl bg-white p-8 shadow-sm">


        <h1 className="text-3xl font-bold">

          Investment Opportunities

        </h1>



        <p className="mt-3 text-gray-600">

          Discover carefully selected real estate
          opportunities and start building your
          investment portfolio.

        </p>


      </section>








      <section className="mt-10 grid gap-8 md:grid-cols-3">



        {properties?.map(
          (property)=>{


          const progress =
            property.funding_goal > 0
            ?
            Math.min(
              (
                property.amount_raised /
                property.funding_goal
              ) * 100,
              100
            )
            :
            0;





          return (


            <div
              key={property.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >






              {property.image_url ? (

                <img

                  src={property.image_url}

                  alt={property.title}

                  className="h-52 w-full object-cover"

                />

              )

              :

              (

                <div className="flex h-52 items-center justify-center bg-gray-200">

                  No Image

                </div>

              )

              }








              <div className="p-6">





                <div className="flex justify-between">


                  <h2 className="text-xl font-bold">

                    {property.title}

                  </h2>





                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">

                    Active

                  </span>


                </div>







                <p className="mt-2 text-gray-600">

                  📍 {property.city}, {property.country}

                </p>







                <p className="mt-4 text-sm text-gray-600 line-clamp-3">

                  {property.description}

                </p>








                <div className="mt-5 space-y-2 text-sm">



                  <div className="flex justify-between">

                    <span>
                      Property Value
                    </span>

                    <strong>
                      ${Number(
                        property.total_value
                      ).toLocaleString()}
                    </strong>

                  </div>






                  <div className="flex justify-between">

                    <span>
                      Minimum Investment
                    </span>

                    <strong>
                      ${Number(
                        property.minimum_investment
                      ).toLocaleString()}
                    </strong>

                  </div>






                  <div className="flex justify-between">

                    <span>
                      Expected ROI
                    </span>

                    <strong className="text-emerald-700">

                      {property.expected_roi}%

                    </strong>

                  </div>




                </div>








                <div className="mt-6">


                  <div className="flex justify-between text-sm">


                    <span>
                      Funding Progress
                    </span>


                    <span>
                      {progress.toFixed(0)}%
                    </span>


                  </div>






                  <div className="mt-2 h-3 rounded-full bg-gray-200">


                    <div

                      className="h-3 rounded-full bg-emerald-700"

                      style={{
                        width:`${progress}%`
                      }}

                    />


                  </div>






                  <p className="mt-2 text-xs text-gray-500">

                    ${Number(
                      property.amount_raised
                    ).toLocaleString()}

                    {" / "}

                    ${Number(
                      property.funding_goal
                    ).toLocaleString()}


                  </p>



                </div>








                <Link

                  href={`/properties/${property.id}`}

                  className="mt-6 block rounded-lg bg-emerald-700 py-3 text-center text-white hover:bg-emerald-800"

                >

                  View Details

                </Link>





              </div>



            </div>


          );


        })}



      </section>








      {(!properties || properties.length===0) && (

        <section className="mt-10 rounded-xl bg-white p-8 text-center">

          <h2 className="text-xl font-bold">

            No investment opportunities available

          </h2>


          <p className="mt-2 text-gray-600">

            New properties will appear here soon.

          </p>


        </section>

      )}



    </main>

  );

}