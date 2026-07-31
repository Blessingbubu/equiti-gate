"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createAdminNotification } from "@/app/admin/notifications/actions";


export default function AdminNotificationForm() {


  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({

    title: "",

    message: "",

    type: "announcement",

  });






  function handleChange(

    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

  ){


    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });


  }







  async function handleSubmit(

    e: React.FormEvent

  ){


    e.preventDefault();


    setLoading(true);





    const result =

      await createAdminNotification(

        formData

      );





    if(result.error){


      toast.error(
        result.error
      );


      setLoading(false);

      return;


    }






    toast.success(

      "Notification sent successfully"

    );






    setFormData({

      title:"",

      message:"",

      type:"announcement",

    });




    setLoading(false);


  }







  return (

    <form

      onSubmit={handleSubmit}

      className="space-y-5"

    >



      <div>


        <label className="mb-2 block text-sm font-medium">

          Notification Title

        </label>



        <input

          name="title"

          value={formData.title}

          onChange={handleChange}

          placeholder="Example: New investment opportunity"

          required

          className="w-full rounded-lg border p-3"

        />


      </div>







      <div>


        <label className="mb-2 block text-sm font-medium">

          Message

        </label>



        <textarea

          name="message"

          value={formData.message}

          onChange={handleChange}

          placeholder="Write your announcement..."

          required

          rows={5}

          className="w-full rounded-lg border p-3"

        />


      </div>







      <div>


        <label className="mb-2 block text-sm font-medium">

          Type

        </label>



        <select

          name="type"

          value={formData.type}

          onChange={(e)=>

            setFormData({

              ...formData,

              type:e.target.value,

            })

          }

          className="w-full rounded-lg border p-3"

        >

          <option value="announcement">

            Announcement

          </option>


          <option value="investment">

            Investment

          </option>


          <option value="system">

            System

          </option>


        </select>


      </div>







      <button

        disabled={loading}

        className="rounded-lg bg-emerald-700 px-6 py-3 text-white disabled:opacity-50"

      >

        {

          loading

          ?

          "Sending..."

          :

          "Send Notification"

        }


      </button>




    </form>

  );

}