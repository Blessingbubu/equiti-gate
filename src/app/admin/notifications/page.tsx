import { createClient } from "@/lib/supabase/server";
import AdminNotificationForm from "@/app/admin/notifications/components/AdminNotificationForm";
import NotificationHistory from "@/app/admin/notifications/components/NotificationHistory";


export default async function AdminNotificationsPage() {


  const supabase =
    await createClient();




  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();





  if(!user){

    return (

      <div className="p-6">

        Please login.

      </div>

    );

  }







  // Check admin role

  const {
    data: profile
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

    return (

      <div className="p-6 text-red-600">

        Access denied.

      </div>

    );

  }







  return (


    <main className="min-h-screen bg-gray-50 p-8">



      <div className="mx-auto max-w-4xl">





        <h1 className="text-3xl font-bold text-emerald-700">

          Send Notification

        </h1>





        <p className="mt-2 text-gray-500">

          Send announcements and updates to Equiti Gates investors.

        </p>







        <div className="mt-8 rounded-xl bg-white p-6 shadow">


          <AdminNotificationForm />


        </div>







        <NotificationHistory />






      </div>



    </main>


  );

}