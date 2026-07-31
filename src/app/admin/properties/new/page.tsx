import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default async function NewPropertyPage() {


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
  } = await supabase
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






  async function createProperty(
    formData: FormData
  ){

    "use server";



    const supabase =
      await createClient();




    await supabase
      .from("properties")
      .insert({

        title:
          formData.get("title"),


        description:
          formData.get("description"),


        country:
          formData.get("country"),


        city:
          formData.get("city"),


        image_url:
          formData.get("image_url"),


        total_value:
          Number(
            formData.get("total_value")
          ),


        minimum_investment:
          Number(
            formData.get("minimum_investment")
          ),


        expected_roi:
          Number(
            formData.get("expected_roi")
          ),


        funding_goal:
          Number(
            formData.get("funding_goal")
          ),


        amount_raised:
          0,


        status:
          "Active"

      });





    redirect("/admin");

  }







  return (


    <main className="min-h-screen bg-gray-100 p-8">


      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">


        <h1 className="text-3xl font-bold">

          Add New Property

        </h1>




        <form
          action={createProperty}
          className="mt-8 space-y-5"
        >





          <input
            name="title"
            placeholder="Property title"
            className="w-full rounded-lg border p-3"
            required
          />






          <textarea
            name="description"
            placeholder="Property description"
            className="w-full rounded-lg border p-3"
            rows={5}
            required
          />







          <input
            name="country"
            placeholder="Country"
            className="w-full rounded-lg border p-3"
            required
          />






          <input
            name="city"
            placeholder="City"
            className="w-full rounded-lg border p-3"
            required
          />







          <input
            name="image_url"
            placeholder="Image URL"
            className="w-full rounded-lg border p-3"
          />







          <input
            name="total_value"
            type="number"
            placeholder="Property total value"
            className="w-full rounded-lg border p-3"
            required
          />







          <input
            name="minimum_investment"
            type="number"
            placeholder="Minimum investment"
            className="w-full rounded-lg border p-3"
            required
          />







          <input
            name="expected_roi"
            type="number"
            placeholder="Expected ROI %"
            className="w-full rounded-lg border p-3"
            required
          />







          <input
            name="funding_goal"
            type="number"
            placeholder="Funding goal"
            className="w-full rounded-lg border p-3"
            required
          />








          <button
            className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white"
          >

            Create Property

          </button>





        </form>



      </div>


    </main>


  );

}