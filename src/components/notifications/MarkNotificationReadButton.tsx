"use client";

import { useTransition } from "react";
import { markNotificationAsRead } from "@/app/api/notifications/actions";


export default function MarkNotificationReadButton({

  notificationId,

}: {

  notificationId:string;

}) {


  const [loading, startTransition] =
    useTransition();





  function handleClick(){


    startTransition(async()=>{


      await markNotificationAsRead(

        notificationId

      );


      window.location.reload();


    });


  }





  return (

    <button

      onClick={handleClick}

      disabled={loading}

      className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-50"

    >

      {
        loading
        ?
        "Reading..."
        :
        "Mark as Read"
      }


    </button>

  );

}