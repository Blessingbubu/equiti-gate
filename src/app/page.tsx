import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import InvestButton from "@/app/(investor)/properties/components/InvestButton";


export default async function Home() {


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
    )
    .limit(3);





  return (

    <>

      <Navbar />

      <main className="min-h-screen bg-white text-gray-900">



        {/* HERO */}

        <section
          className="
          relative
          flex
          min-h-[90vh]
          items-center
          justify-center
          overflow-hidden
          "
        >

          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Real Estate"
            className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            "
          />


          <div
            className="
            absolute
            inset-0
            bg-black/70
            "
          />


          <div
            className="
            relative
            z-10
            mx-auto
            max-w-6xl
            px-8
            text-center
            text-white
            "
          >

            <p
              className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.35em]
              text-emerald-300
              "
            >
              Global Real Estate Investment
            </p>



            <h1
              className="
              mt-6
              text-5xl
              font-black
              leading-tight
              md:text-7xl
              "
            >
              Invest In Premium Properties.
              <br />
              Build Wealth Without Borders.
            </h1>



            <p
              className="
              mx-auto
              mt-8
              max-w-3xl
              text-xl
              text-gray-200
              "
            >
              Equiti Gates connects investors worldwide with carefully
              selected real estate opportunities through secure and
              transparent investment.
            </p>



            <div
              className="
              mt-12
              flex
              flex-wrap
              justify-center
              gap-5
              "
            >

              <Link
                href="/invest"
                className="
                rounded-xl
                bg-emerald-600
                px-8
                py-4
                font-semibold
                text-white
                hover:bg-emerald-500
                "
              >
                Start Investing
              </Link>



              <Link
                href="/properties"
                className="
                rounded-xl
                border
                border-white/40
                bg-white/10
                px-8
                py-4
                font-semibold
                text-white
                backdrop-blur
                hover:bg-white/20
                "
              >
                Explore Properties
              </Link>


            </div>


          </div>


        </section>







        {/* STATS */}


        <section className="border-b px-8 py-12">

          <div
            className="
            mx-auto
            grid
            max-w-5xl
            gap-8
            text-center
            md:grid-cols-4
            "
          >

            <Stat number="500+" label="Investors" />
            <Stat number="25+" label="Properties" />
            <Stat number="10+" label="Countries" />
            <Stat number="12%" label="Average ROI" />

          </div>

        </section>









        {/* PROPERTY MARKETPLACE */}


        <section className="px-8 py-20">


          <div className="mx-auto max-w-6xl">


            <div className="text-center">


              <p
                className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.3em]
                text-emerald-700
                "
              >
                Featured Opportunities
              </p>


              <h2 className="mt-4 text-4xl font-bold">

                Premium Investment Properties

              </h2>


            </div>






            <div
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
                            h-64
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







                    <div className="p-7">


                      <h3
                        className="
                        text-2xl
                        font-bold
                        "
                      >

                        {property.title}

                      </h3>




                      <p className="mt-2 text-gray-500">

                        📍 {property.city}, {property.country}

                      </p>






                      <div className="mt-6 space-y-3 text-sm">


                        <p>

                          Property Value:

                          <strong className="float-right">

                            $
                            {Number(
                              property.total_value || 0
                            ).toLocaleString()}

                          </strong>

                        </p>




                        <p>

                          Minimum Investment:

                          <strong className="float-right">

                            $
                            {Number(
                              property.minimum_investment || 0
                            ).toLocaleString()}

                          </strong>

                        </p>



                      </div>







                      <div className="mt-6">


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






                      <Link

                        href={`/invest/${property.id}`}

                        className="
                        mt-7
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

                        Open Opportunity

                      </Link>



                    </div>



                  </div>


                ))
              }


            </div>


          </div>


        </section>








        {/* HOW IT WORKS */}


        <section
          className="
          bg-gray-100
          px-8
          py-20
          text-center
          "
        >

          <h2 className="text-4xl font-bold">

            How Equiti Gates Works

          </h2>


          <div
            className="
            mx-auto
            mt-10
            grid
            max-w-5xl
            gap-8
            md:grid-cols-4
            "
          >

            <Step number="1" text="Create Account" />
            <Step number="2" text="Choose Property" />
            <Step number="3" text="Invest Securely" />
            <Step number="4" text="Track Returns" />

          </div>


        </section>







        <footer
          className="
          border-t
          px-8
          py-8
          text-center
          text-gray-500
          "
        >

          © {new Date().getFullYear()} Equiti Gates

        </footer>



      </main>


    </>

  );

}







function Stat({
  number,
  label,
}: {
  number:string;
  label:string;
}) {


  return (

    <div>

      <h3 className="text-4xl font-bold text-emerald-700">

        {number}

      </h3>

      <p className="mt-2 text-gray-500">

        {label}

      </p>


    </div>

  );

}







function Step({
  number,
  text,
}: {
  number:string;
  text:string;
}) {


  return (

    <div>

      <div className="text-3xl font-bold text-emerald-700">

        {number}

      </div>


      <p className="mt-3 text-gray-600">

        {text}

      </p>


    </div>

  );

}