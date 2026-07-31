"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function VerificationForm({

  userId,
  country,
  address,

}:{

  userId:string;
  country:string;
  address:string;

}) {


  const supabase =
    createClient();



  const [loading,setLoading] =
    useState(false);


  const [message,setMessage] =
    useState("");



  async function submitVerification(
    e:React.FormEvent<HTMLFormElement>
  ){

    e.preventDefault();


    setMessage("");



    const form =
      new FormData(e.currentTarget);



    const countryValue =
      form.get("country") as string;


    const addressValue =
      form.get("address") as string;



    const file =
      form.get("document") as File;



    if(!file){

      setMessage(
        "Please upload your identity document."
      );

      return;

    }






    if(file.size > 5 * 1024 * 1024){

      setMessage(
        "File size must be below 5MB."
      );

      return;

    }







    const allowedTypes = [

      "image/jpeg",
      "image/png",
      "application/pdf"

    ];





    if(
      !allowedTypes.includes(
        file.type
      )
    ){

      setMessage(
        "Only JPG, PNG or PDF files are allowed."
      );

      return;

    }







    try{


      setLoading(true);
      console.log("CURRENT USER ID:", userId);





      const fileExtension =
        file.name.split(".").pop();



      const filePath =
        `${userId}/${Date.now()}.${fileExtension}`;







      const {
        error:uploadError

      } =
      await supabase
        .storage
        .from("kyc-documents")
        .upload(
          filePath,
          file
        );







      if(uploadError){

        throw uploadError;

      }









      const {
  data: updatedProfile,
  error: updateError

} =
await supabase
  .from("profiles")
  .update({
    country: countryValue,
    address: addressValue,
    id_document_url: filePath,
    verification_status: "Under Review"
  })
  .eq("id", userId)
  .select();

console.log("UPDATED PROFILE:", updatedProfile);







      if(updateError){

  console.log("PROFILE UPDATE ERROR:", updateError);

  throw updateError;

}
else{

  console.log("PROFILE UPDATED SUCCESSFULLY");

}







      setMessage(
        "Verification submitted successfully. Your account is under review."
      );




    }

    catch(error:any){


      setMessage(
        error.message ||
        "Something went wrong."
      );


    }

    finally{

      setLoading(false);

    }


  }








  return (


    <form

      onSubmit={submitVerification}

      className="space-y-5"

    >





      <div>

        <label className="text-sm text-gray-600">

          Country

        </label>


        <input

          name="country"

          defaultValue={country}

          required

          className="mt-2 w-full rounded-lg border p-3"

          placeholder="Enter country"

        />

      </div>







      <div>

        <label className="text-sm text-gray-600">

          Address

        </label>



        <textarea

          name="address"

          defaultValue={address}

          required

          className="mt-2 w-full rounded-lg border p-3"

          placeholder="Enter address"

        />

      </div>







      <div>

        <label className="text-sm text-gray-600">

          Identity Document

        </label>



        <input

          type="file"

          name="document"

          accept=".jpg,.jpeg,.png,.pdf"

          className="mt-2 w-full rounded-lg border p-3"

        />

      </div>







      {
        message && (

          <div className="rounded-lg bg-gray-100 p-4 text-sm">

            {message}

          </div>

        )
      }







      <button

        disabled={loading}

        className="w-full rounded-lg bg-emerald-700 py-3 text-white disabled:opacity-50"

      >

        {
          loading
          ?
          "Submitting..."
          :
          "Submit Verification"
        }

      </button>






    </form>


  );

}