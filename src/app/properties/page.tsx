import { createClient } from "@/lib/supabase/server";
import InvestButton from "@/app/(investor)/properties/components/InvestButton";


export default async function PropertiesPage() {


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


    <main className="min-h-screen bg-gray-50">



      <section
        className="
        bg-emerald-950
        px-8
        py-24
        text-center
        text-white
        "
      >

        <div className="mx-auto max-w-5xl">


          <p
            className="
            text-sm
            font-semibold
            uppercase
            tracking-[0.35em]
            text-emerald-300
            "
          >

            Investment Marketplace

          </p>



          <h1
            className="
            mt-6
            text-5xl
            font-black
            md:text-6xl
            "
          >

            Premium Real Estate Opportunities

          </h1>




          <p
            className="
            mx-auto
            mt-6
            max-w-3xl
            text-lg
            text-emerald-100
            "
          >

            Explore carefully selected properties and participate
            in global real estate investments with Equiti Gates.

          </p>


        </div>


      </section>





      <section className="px-8 py-20">


        <div className="mx-auto max-w-7xl">


          <div
            className="
            grid
            gap-10
            md:grid-cols-3
            "
          >


            {
              properties?.map((property)=>(


                <div

                  key={property.id}

                  className="
                  group
                  overflow-hidden
                  rounded-3xl
                  border
                  bg-white
                  shadow-lg
                  transition
                  hover:-translate-y-2
                  hover:shadow-2xl
                  "

                >



                  <div className="relative">


                    {
                      property.image_url && (

                        <img

                          src={property.image_url}

                          alt={property.title}

                          className="
                          h-72
                          w-full
                          object-cover
                          transition
                          duration-500
                          group-hover:scale-105
                          "

                        />

                      )
                    }




                    <div
                      className="
                      absolute
                      left-5
                      top-5
                      rounded-full
                      bg-emerald-600
                      px-4
                      py-2
                      text-sm
                      font-bold
                      text-white
                      "
                    >

                      {property.expected_roi}% ROI

                    </div>





                    <div
                      className="
                      absolute
                      right-5
                      top-5
                      rounded-full
                      bg-black/70
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      "
                    >

                      {
                        Math.round(

                          (
                            Number(property.amount_raised || 0) /
                            Number(property.funding_goal || 1)

                          ) * 100

                        )
                      }%

                      Funded

                    </div>



                  </div>







                  <div className="p-8">


                    <h2
                      className="
                      text-2xl
                      font-bold
                      "
                    >

                      {property.title}

                    </h2>




                    <p className="mt-3 text-gray-500">

                      📍 {property.city}, {property.country}

                    </p>







                    <div
                      className="
                      mt-7
                      space-y-4
                      "
                    >



                      <div className="flex justify-between">

                        <span className="text-gray-500">

                          Property Value

                        </span>


                        <strong>

                          $
                          {Number(
                            property.total_value || 0
                          ).toLocaleString()}

                        </strong>


                      </div>






                      <div className="flex justify-between">


                        <span className="text-gray-500">

                          Minimum Investment

                        </span>



                        <strong>

                          $
                          {Number(
                            property.minimum_investment || 0
                          ).toLocaleString()}

                        </strong>



                      </div>



                    </div>







                    <div className="mt-8">


                      <div
                        className="
                        mb-2
                        flex
                        justify-between
                        text-sm
                        text-gray-500
                        "
                      >


                        <span>
                          Funding Progress
                        </span>


                        <span>

                          $
                          {Number(
                            property.amount_raised || 0
                          ).toLocaleString()}

                          /

                          $
                          {Number(
                            property.funding_goal || 0
                          ).toLocaleString()}


                        </span>


                      </div>





                      <div
                        className="
                        h-3
                        rounded-full
                        bg-gray-200
                        "
                      >

                        <div

                          className="
                          h-3
                          rounded-full
                          bg-emerald-600
                          "

                          style={{

                            width:`${
                              Math.min(

                                (
                                  Number(property.amount_raised || 0) /
                                  Number(property.funding_goal || 1)

                                ) * 100,

                                100

                              )

                            }%`

                          }}

                        />

                      </div>


                    </div>






                    <div className="mt-8">


                      <InvestButton

                        propertyId={property.id}

                        minimumInvestment={property.minimum_investment}

                        propertyName={property.title}

                        location={`${property.city}, ${property.country}`}

                      />


                    </div>





                  </div>


                </div>


              ))
            }





          </div>







          {
            (!properties || properties.length === 0) && (

              <div
                className="
                rounded-2xl
                bg-white
                p-10
                text-center
                shadow
                "
              >

                <h2 className="text-2xl font-bold">

                  No Properties Available

                </h2>


                <p className="mt-3 text-gray-600">

                  New opportunities will appear here soon.

                </p>


              </div>

            )
          }





        </div>


      </section>



    </main>


  );

}