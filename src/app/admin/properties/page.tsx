import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function AdminPropertiesPage(){


  const supabase = await createClient();




  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();




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
    data:properties
  } =
  await supabase
    .from("properties")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false
      }
    );








  return (


    <main>


      <div className="max-w-6xl">



        <div className="flex items-center justify-between">


          <div>


            <h1 className="text-3xl font-bold">

              Properties

            </h1>


            <p className="mt-2 text-gray-500">

              Manage available investment properties.

            </p>


          </div>





          <Link

            href="/admin/properties/new"

            className="rounded-lg bg-emerald-700 px-5 py-3 text-white"

          >

            + Add Property

          </Link>



        </div>








        <div className="mt-8 grid gap-6 md:grid-cols-2">



          {
            properties?.map((property)=>(


              <div

                key={property.id}

                className="rounded-xl bg-white p-6 shadow"

              >



                <h2 className="text-xl font-bold">

                  {property.title}

                </h2>




                <p className="mt-2 text-gray-500">

                  📍 {property.city}, {property.country}

                </p>






                <div className="mt-5 space-y-2">


                  <p>

                    Total Value:
                    {" "}
                    <strong>

                    ${Number(
                      property.total_value || 0
                    ).toLocaleString()}

                    </strong>

                  </p>




                  <p>

                    Minimum Investment:
                    {" "}
                    <strong>

                    ${Number(
                      property.minimum_investment || 0
                    ).toLocaleString()}

                    </strong>

                  </p>





                  <p>

                    Expected ROI:
                    {" "}
                    <strong>

                    {property.expected_roi || 0}%

                    </strong>

                  </p>





                  <p>

                    Status:
                    {" "}
                    <strong className="text-emerald-700">

                    {property.status}

                    </strong>

                  </p>



                </div>





              </div>


            ))
          }




        </div>




      </div>


    </main>


  );

}