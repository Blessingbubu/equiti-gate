"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications/createNotification";


export async function updateVerificationStatus(

  userId: string,

  status: "Verified" | "Rejected"

) {


  const supabase =
    await createClient();





  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();





  if(!user){

    return {

      error:
        "Unauthorized"

    };

  }









  // Check admin role

  const {

    data:adminProfile,

    error:adminError

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

    adminError ||

    !adminProfile ||

    adminProfile.role !== "admin"

  ){

    return {

      error:
        "Access denied"

    };

  }









  // Update investor verification status

  const {

    error:updateError

  } =
  await supabase
    .from("profiles")
    .update({

      verification_status:
        status,


      verified_at:

        status === "Verified"

        ?

        new Date().toISOString()

        :

        null


    })
    .eq(
      "id",
      userId
    );







  if(updateError){

    return {

      error:
        updateError.message

    };

  }









  // Create notification

  if(status === "Verified"){


    await createNotification({

      userId,


      title:
        "Identity Verification Approved",


      message:
        "Your identity verification has been approved. You can now access full investor features.",


      type:
        "verification"

    });


  }







  if(status === "Rejected"){


    await createNotification({

      userId,


      title:
        "Identity Verification Rejected",


      message:
        "Your identity verification was not approved. Please review your documents and submit again.",


      type:
        "verification"

    });


  }









  revalidatePath(
    "/admin/verification"
  );


  revalidatePath(
    "/profile"
  );





  return {

    success:true

  };


}