"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


export async function createAdminNotification({

  title,

  message,

  type = "announcement",

}: {

  title:string;

  message:string;

  type?:string;

}) {


  const supabase =
    await createClient();




  // Check logged in user

  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();




  if(!user){

    return {

      error:"Unauthorized"

    };

  }






  // Check admin role

  const {
    data:profile,
    error:profileError
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

    profileError ||

    !profile ||

    profile.role !== "admin"

  ){

    return {

      error:"Access denied"

    };

  }







  // Get all investors

  const {
    data: investors,
    error:investorError
  } =
  await supabase
    .from("profiles")
    .select("id")
    .eq(
      "role",
      "investor"
    );





  if(investorError){

    return {

      error:investorError.message

    };

  }





  if(!investors || investors.length === 0){

    return {

      error:"No investors found"

    };

  }







  // Create notifications

  const notifications = investors.map(

    (investor)=>({

      user_id:
        investor.id,

      title,

      message,

      type,

      is_read:false,

    })

  );







  const {
    error
  } =
  await supabase
    .from("notifications")
    .insert(
      notifications
    );






  if(error){

    return {

      error:error.message

    };

  }





  revalidatePath("/admin/notifications");




  return {

    success:true

  };


}