import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function GET() {


  const supabase =
    await createClient();




  const {
    data:{
      user
    },
    error:userError
  } =
  await supabase.auth.getUser();




  console.log(
    "CURRENT USER:",
    user?.id
  );




  if(userError || !user){

    console.log(
      "NO USER SESSION"
    );


    return NextResponse.json({

      count:0

    });

  }






  const {
    count,
    error
  } =
  await supabase
    .from("notifications")
    .select(
      "*",
      {
        count:"exact",
        head:true
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






  console.log(
    "UNREAD COUNT:",
    count
  );



  if(error){

    console.error(
      "NOTIFICATION COUNT ERROR:",
      error
    );


    return NextResponse.json({

      count:0

    });

  }





  return NextResponse.json({

    count: count || 0

  });


}