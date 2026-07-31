import { createClient } from "@/lib/supabase/server";


export async function createNotification({

  userId,

  title,

  message,

  type = "general",

}: {

  userId: string;

  title: string;

  message: string;

  type?: string;

}) {


  const supabase = await createClient();



  const {
    error
  } =
  await supabase
    .from("notifications")
    .insert({

      user_id:
        userId,

      title,

      message,

      type,

      is_read:
        false,

    });




  if(error){

    console.error(
      "NOTIFICATION ERROR:",
      error
    );

    return {
      success:false,
      error:error.message
    };

  }




  return {
    success:true
  };


}