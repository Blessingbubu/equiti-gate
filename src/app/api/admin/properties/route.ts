import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function POST(
  request: Request
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

    return NextResponse.json(
      {
        error:"Not authenticated"
      },
      {
        status:401
      }
    );

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

    return NextResponse.json(
      {
        error:"Unauthorized"
      },
      {
        status:403
      }
    );

  }






  const formData =
    await request.formData();





  const imageUrls =
    JSON.parse(
      String(
        formData.get("image_urls") || "[]"
      )
    );






  const {
    data:property,
    error:propertyError
  } =
  await supabase
    .from("properties")
    .insert({

      title:
        formData.get("title"),


      description:
        formData.get("description"),


      country:
        formData.get("country"),


      city:
        formData.get("city"),


      image_url:
        formData.get("image_url"),


      total_value:
        Number(
          formData.get("total_value")
        ),


      minimum_investment:
        Number(
          formData.get("minimum_investment")
        ),


      expected_roi:
        Number(
          formData.get("expected_roi")
        ),


      funding_goal:
        Number(
          formData.get("funding_goal")
        ),


      amount_raised:
        0,


      status:
        "Active"

    })
    .select()
    .single();







  if(propertyError){


    console.error(
      propertyError
    );


    return NextResponse.json(

      {
        error:propertyError.message
      },

      {
        status:500
      }

    );

  }








  if(
    imageUrls.length > 0
  ){


    const images =
      imageUrls.map(
        (url:string)=>({

          property_id:
            property.id,


          image_url:
            url

        })
      );






    const {
      error:imageError
    } =
    await supabase
      .from("property_images")
      .insert(images);






    if(imageError){


      console.error(
        imageError
      );


      return NextResponse.json(

        {
          error:imageError.message
        },

        {
          status:500
        }

      );

    }


  }








  return NextResponse.json({

    success:true

  });


}