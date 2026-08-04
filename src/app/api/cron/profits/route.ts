import { NextResponse } from "next/server";
import { runProfitEngine } from "@/lib/investment/runProfitEngine";


export async function GET(
  request: Request
) {


  const authHeader =
    request.headers.get(
      "authorization"
    );



  if(
    authHeader !==
    `Bearer ${process.env.CRON_SECRET}`
  ){

    return NextResponse.json(
      {
        error:"Unauthorized"
      },
      {
        status:401
      }
    );

  }







  try {


    await runProfitEngine();




    return NextResponse.json({

      success:true,

      message:
        "Global profit engine executed"

    });



  } catch(error){



    console.log(
      "CRON PROFIT ERROR:",
      error
    );



    return NextResponse.json(

      {
        success:false,
        error:"Profit engine failed"
      },

      {
        status:500
      }

    );


  }


}