import { createClient } from "@/lib/supabase/server";


export default async function UnreadNotificationCount() {


  const supabase = await createClient();



  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();




  if (!user) {

    return null;

  }





  const {
    count,
    error
  } = await supabase
    .from("notifications")
    .select(
      "*",
      {
        count: "exact",
        head: true
      }
    )
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "is_read",
      false
    );





  if (error || !count) {

    return null;

  }





  return (

    <span className="ml-auto rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">

      {count}

    </span>

  );

}