"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function ImageUpload({
  onUploadComplete,
}: {
  onUploadComplete: (urls: string[]) => void;
}) {


  const [uploading, setUploading] =
    useState(false);


  const [previews, setPreviews] =
    useState<string[]>([]);



  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {


    try {


      const files =
        event.target.files;


      if(!files || files.length === 0)
        return;



      setUploading(true);



      const supabase =
        createClient();



      const uploadedUrls:string[] = [];



      const previewUrls =
        Array.from(files).map(
          file =>
            URL.createObjectURL(file)
        );


      setPreviews(previewUrls);





      for(
        const file of Array.from(files)
      ){


        const fileName =
          `${Date.now()}-${file.name.replace(/\s/g,"-")}`;




        const {
          error
        } =
        await supabase
          .storage
          .from("property-images")
          .upload(
            fileName,
            file
          );




        if(error){

          throw error;

        }





        const {
          data
        } =
        supabase
          .storage
          .from("property-images")
          .getPublicUrl(
            fileName
          );



        uploadedUrls.push(
          data.publicUrl
        );

      }





      onUploadComplete(
        uploadedUrls
      );



    }
    catch(error){

      console.error(
        "UPLOAD ERROR",
        error
      );

      alert(
        "Image upload failed"
      );


    }
    finally{

      setUploading(false);

    }


  }





  return (

    <div className="space-y-4">


      <label className="block font-semibold">

        Property Images

      </label>



      <input

        type="file"

        accept="image/*"

        multiple

        onChange={handleUpload}

        className="w-full rounded-lg border p-3"

      />



      {
        uploading && (

          <p className="text-gray-500">

            Uploading images...

          </p>

        )
      }



      <div className="grid grid-cols-2 gap-3">

        {
          previews.map(
            (image,index)=>(

              <img

                key={index}

                src={image}

                alt="preview"

                className="h-32 w-full rounded-lg object-cover"

              />

            )
          )
        }

      </div>


    </div>

  );

}