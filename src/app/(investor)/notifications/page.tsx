import { createClient } from "@/lib/supabase/server";
import MarkNotificationReadButton from "@/components/notifications/MarkNotificationReadButton";


export default async function NotificationsPage() {


  const supabase = await createClient();


  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();



  if(!user){

    return (

      <div className="p-6">

        Please login to view notifications.

      </div>

    );

  }



  const {
    data: notifications,
    error
  } =
  await supabase
    .from("notifications")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );




  if(error){

    return (

      <div className="p-6 text-red-600">

        Failed to load notifications.

      </div>

    );

  }




  return (

    <main className="min-h-screen bg-gray-50 p-8">

      <div className="mx-auto max-w-4xl">


        <h1 className="text-3xl font-bold text-emerald-700">

          Notifications

        </h1>


        <p className="mt-2 text-gray-500">

          Your latest Equiti Gate updates.

        </p>





        <div className="mt-8 space-y-4">


          {
            notifications &&
            notifications.length > 0

            ?

            notifications.map((notification)=>(


              <div

                key={notification.id}

                className={

                  notification.is_read

                  ?

                  "rounded-xl border bg-white p-5"

                  :

                  "rounded-xl border border-emerald-300 bg-emerald-50 p-5"

                }

              >



                <div className="flex justify-between">


                  <h2 className="text-lg font-semibold">

                    {notification.title}

                  </h2>



                  {
                    !notification.is_read && (

                      <span className="text-sm font-semibold text-emerald-700">

                        New

                      </span>

                    )
                  }



                </div>





                <p className="mt-2 text-gray-600">

                  {notification.message}

                </p>






                <div className="mt-4 flex items-center justify-between">


                  <p className="text-xs text-gray-400">

                    {
                      new Date(
                        notification.created_at
                      ).toLocaleString()
                    }

                  </p>





                  {
                    !notification.is_read && (

                      <MarkNotificationReadButton

                        notificationId={
                          notification.id
                        }

                      />

                    )
                  }



                </div>





              </div>


            ))

            :

            (

              <div className="rounded-xl bg-white p-6 text-center text-gray-500">

                No notifications yet.

              </div>

            )

          }


        </div>


      </div>


    </main>

  );

}