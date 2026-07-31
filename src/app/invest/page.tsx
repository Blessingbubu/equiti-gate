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

    redirect("/login");

  }








  return (

    <main className="min-h-screen bg-gray-50 px-8 py-10">


      <div className="mx-auto max-w-4xl">





        <section className="rounded-xl bg-white p-8 shadow-sm">



          {property.image_url && (

            <img

              src={property.image_url}

              alt={property.title}

              className="h-72 w-full rounded-xl object-cover"

            />

          )}







          <h1 className="mt-8 text-3xl font-bold">

            Invest in {property.title}

          </h1>








          <p className="mt-3 text-gray-600">

            📍 {property.city}, {property.country}

          </p>







          <p className="mt-6 text-gray-700">

            {property.description}

          </p>





        </section>









        <section className="mt-8 grid gap-6 md:grid-cols-3">



          <div className="rounded-lg bg-gray-100 p-4">


            <p className="text-sm text-gray-500">

              Property Value

            </p>


            <p className="text-xl font-bold">

              ${Number(
                property.total_value
              ).toLocaleString()}

            </p>


          </div>








          <div className="rounded-lg bg-gray-100 p-4">


            <p className="text-sm text-gray-500">

              Minimum Investment

            </p>


            <p className="text-xl font-bold">

              ${Number(
                property.minimum_investment
              ).toLocaleString()}

            </p>


          </div>








          <div className="rounded-lg bg-gray-100 p-4">


            <p className="text-sm text-gray-500">

              Expected ROI

            </p>


            <p className="text-xl font-bold text-emerald-700">

              {property.expected_roi}%

            </p>


          </div>




        </section>









        <section className="mt-8 rounded-xl bg-white p-8 shadow-sm">



          <h2 className="text-2xl font-bold">

            Choose Investment Amount

          </h2>






          <p className="mt-2 text-gray-600">

            Minimum investment:

            ${Number(
              property.minimum_investment
            ).toLocaleString()}

          </p>








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





        </section>





      </div>



    </main>

  );

}