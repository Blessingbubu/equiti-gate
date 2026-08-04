import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


export default async function InvestPage() {


  const supabase = await createClient();



  const {
    data: properties,
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




  return (

    <main className="min-h-screen bg-gray-50 px-8 py-16">


      <div className="mx-auto max-w-6xl">


        {/* Header */}

        <section className="text-center">


          <p
            className="
            text-sm
            font-semibold
            uppercase
            tracking-[0.3em]
            text-emerald-700
            "
          >
            Investment Opportunities
          </p>




          <h1
            className="
            mt-4
            text-5xl
            font-bold
            tracking-tight
            "
          >
            Invest in Real Estate Opportunities
          </h1>





          <p
            className="
            mx-auto
            mt-6
            max-w-3xl
            text-lg
            text-gray-600
            "
          >
            Explore carefully selected properties and participate
            in global real estate investment opportunities.
          </p>



        </section>





        {/* Properties */}

        <section
          className="
          mt-12
          grid
          gap-8
          md:grid-cols-3
          "
        >


          {
            properties?.map((property)=>(


              <div
                key={property.id}
                className="
                premium-card
                overflow-hidden
                "
              >



                {
                  property.image_url && (

                    <img

                      src={property.image_url}

                      alt={property.title}

                      className="
                      h-56
                      w-full
                      object-cover
                      "

                    />

                  )
                }





                <div className="p-6">


                  <h2
                    className="
                    text-xl
                    font-bold
                    "
                  >

                    {property.title}

                  </h2>





                  <p className="mt-2 text-gray-500">

                    📍 {property.city}, {property.country}

                  </p>






                  <div className="mt-5 space-y-2">


                    <p>

                      Minimum Investment:

                      <strong className="ml-2">

                        ${Number(
                          property.minimum_investment
                        ).toLocaleString()}

                      </strong>

                    </p>





                    <p
                      className="
                      font-semibold
                      text-emerald-700
                      "
                    >

                      Expected ROI:

                      {" "}

                      {property.expected_roi}%

                    </p>



                  </div>






                  <Link

                    href={`/invest/${property.id}`}

                    className="
                    mt-6
                    block
                    rounded-xl
                    bg-emerald-700
                    py-3
                    text-center
                    font-semibold
                    text-white
                    transition
                    hover:bg-emerald-800
                    "

                  >

                    View Investment

                  </Link>




                </div>



              </div>


            ))
          }



        </section>






        {
          (!properties || properties.length === 0) && (


            <div
              className="
              mt-12
              rounded-xl
              bg-white
              p-8
              text-center
              shadow
              "
            >

              <h2 className="text-xl font-bold">

                No Investment Opportunities Available Yet

              </h2>


              <p className="mt-3 text-gray-600">

                New properties will appear here once they are listed.

              </p>


            </div>


          )
        }



      </div>


    </main>

  );

}