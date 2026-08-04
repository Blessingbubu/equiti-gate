import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import InvestmentForm from "@/components/investments/InvestmentForm";



export default async function InvestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {



  const { id } = await params;


  const supabase = await createClient();




  const {
    data: property,
    error,
  } = await supabase
    .from("properties")
    .select("*")
    .eq(
      "id",
      id
    )
    .single();





  if(error || !property){

    notFound();

  }






  const {
    data:{
      user,
    },
  } = await supabase.auth.getUser();





  if(!user){
  redirect(`/register?redirect=/invest/${id}`);
}






  const fundingPercentage = Math.min(

    (
      Number(property.amount_raised || 0) /
      Number(property.funding_goal || 1)

    ) * 100,

    100

  );







  return (



    <main className="min-h-screen bg-gray-50 px-8 py-12">



      <div className="mx-auto max-w-6xl">





        {/* PROPERTY HEADER */}



        <section
          className="
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-xl
          "
        >



          <div className="relative">



            {
              property.image_url && (

                <img

                  src={property.image_url}

                  alt={property.title}

                  className="
                  h-[420px]
                  w-full
                  object-cover
                  "

                />

              )
            }







            <div
              className="
              absolute
              left-6
              top-6
              rounded-full
              bg-emerald-600
              px-5
              py-3
              font-bold
              text-white
              "
            >

              {property.expected_roi}% Expected ROI

            </div>





          </div>







          <div className="p-10">



            <h1
              className="
              text-4xl
              font-black
              "
            >

              Invest in {property.title}

            </h1>





            <p className="mt-3 text-gray-500">

              📍 {property.city}, {property.country}

            </p>






            <p className="mt-6 text-lg text-gray-700">

              {property.description}

            </p>





          </div>



        </section>









        {/* INVESTMENT DETAILS */}



        <section
          className="
          mt-10
          grid
          gap-6
          md:grid-cols-4
          "
        >




          <InfoCard

            title="Property Value"

            value={`$${Number(
              property.total_value || 0
            ).toLocaleString()}`}

          />





          <InfoCard

            title="Minimum Investment"

            value={`$${Number(
              property.minimum_investment || 0
            ).toLocaleString()}`}

          />





          <InfoCard

            title="Expected ROI"

            value={`${property.expected_roi}%`}

            green

          />





          <InfoCard

            title="Investors"

            value="Secure"

          />




        </section>









        {/* FUNDING */}



        <section
          className="
          mt-8
          rounded-3xl
          bg-white
          p-8
          shadow-lg
          "
        >



          <div
            className="
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
            mt-3
            h-4
            rounded-full
            bg-gray-200
            "
          >



            <div

              className="
              h-4
              rounded-full
              bg-emerald-600
              "

              style={{
                width:`${fundingPercentage}%`
              }}

            />



          </div>






          <p className="mt-3 text-sm text-gray-500">

            {Math.round(fundingPercentage)}% funded

          </p>



        </section>









        {/* INVEST FORM */}



        <section
          className="
          mt-10
          rounded-3xl
          bg-white
          p-10
          shadow-xl
          "
        >



          <h2
            className="
            text-3xl
            font-black
            "
          >

            Start Your Investment

          </h2>




          <p className="mt-3 text-gray-600">

            Minimum investment:

            {" "}

            <strong>

              $
              {Number(
                property.minimum_investment || 0
              ).toLocaleString()}

            </strong>

          </p>






          <div className="mt-8">



            <InvestmentForm



              property={{

                id:
                  property.id,


                title:
                  property.title,


                city:
                  property.city,


                country:
                  property.country,


                minimum_investment:
                  Number(
                    property.minimum_investment
                  ),


                expected_roi:
                  Number(
                    property.expected_roi
                  ),


                amount_raised:
                  Number(
                    property.amount_raised
                  ),

              }}



              userId={
                user.id
              }



            />


          </div>




        </section>






      </div>


    </main>


  );

}









function InfoCard({

  title,

  value,

  green=false,

}: {

  title:string;

  value:string;

  green?:boolean;

}) {



  return (

    <div
      className="
      rounded-2xl
      bg-white
      p-6
      shadow
      "
    >


      <p className="text-sm text-gray-500">

        {title}

      </p>



      <p
        className={`
        mt-2
        text-2xl
        font-black
        ${green ? "text-emerald-700" : "text-gray-900"}
        `}
      >

        {value}

      </p>


    </div>


  );

}