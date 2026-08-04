import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";


export default async function NewPropertyPage() {


  const supabase =
    await createClient();



  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();




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






  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">


        <h1 className="text-3xl font-bold">

          Add New Property

        </h1>


        <p className="mt-2 text-gray-500">

          Upload property details and images.

        </p>




        <PropertyForm />


      </div>


    </main>

  );

}