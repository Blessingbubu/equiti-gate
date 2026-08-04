import { createClient } from "@/lib/supabase/server";


export default async function NotificationHistory() {


  const supabase =
    await createClient();




  const {
    data: notifications,
    error
  } =
  await supabase
    .from("notifications")
    .select(
      `
      id,
      title,
      message,
      type,
      created_at,
      user_id
      `
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    )
    .limit(50);





  if(error){

    return (

      <div className="mt-8 rounded-xl bg-red-50 p-5 text-red-600">

        Failed to load notification history.

      </div>

    );

  }





  return (

    <div className="mt-8 rounded-xl bg-white p-6 shadow">


      <h2 className="text-xl font-bold text-gray-800">

        Notification History

      </h2>


      <p className="mt-1 text-sm text-gray-500">

        Latest notifications sent through Equiti Gates.

      </p>





      <div className="mt-6 space-y-4">



        {
          notifications &&
          notifications.length > 0

          ?

          notifications.map((notification)=>(


            <div

              key={notification.id}

              className="rounded-lg border p-4"

            >



              <div className="flex justify-between">


                <h3 className="font-semibold">

                  {notification.title}

                </h3>



                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">

                  {notification.type}

                </span>



              </div>





              <p className="mt-2 text-sm text-gray-600">

                {notification.message}

              </p>





              <div className="mt-3 flex justify-between text-xs text-gray-400">


                <span>

                  User ID:

                  {" "}

                  {notification.user_id.slice(0,8)}...

                </span>



                <span>

                  {
                    new Date(
                      notification.created_at
                    ).toLocaleString()
                  }

                </span>



              </div>




            </div>


          ))



          :



          (

            <div className="rounded-lg bg-gray-50 p-5 text-center text-gray-500">

              No notifications sent yet.

            </div>

          )

        }



      </div>



    </div>

  );

}