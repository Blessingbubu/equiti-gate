"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


export async function markNotificationAsRead(

  notificationId: string

) {


  const supabase =
    await createClient();




  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser();




  if (!user) {

    return {

      success:false,

      error:"Unauthorized"

    };

  }





  const {
    error
  } =
  await supabase
    .from("notifications")
    .update({

      is_read:true

    })
    .eq(
      "id",
      notificationId
    )
    .eq(
      "user_id",
      user.id
    );





  if(error){

    return {

      success:false,

      error:error.message

    };

  }





  revalidatePath("/dashboard");
  revalidatePath("/notifications");





  return {

    success:true

  };


}