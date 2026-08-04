"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";

export default function PropertyForm() {


  const [imageUrls, setImageUrls] =
    useState<string[]>([]);




  return (

    <form
      action="/api/admin/properties"
      method="POST"
      className="mt-8 space-y-5"
    >



      <input
        name="title"
        placeholder="Property title"
        className="w-full rounded-lg border p-3"
        required
      />





      <textarea
        name="description"
        placeholder="Property description"
        className="w-full rounded-lg border p-3"
        rows={5}
        required
      />





      <input
        name="country"
        placeholder="Country"
        className="w-full rounded-lg border p-3"
        required
      />





      <input
        name="city"
        placeholder="City"
        className="w-full rounded-lg border p-3"
        required
      />





      <ImageUpload

        onUploadComplete={
          (urls)=>{

            setImageUrls(urls);

          }
        }

      />





      {/* 
        Keep the first image as the main property image
        for compatibility with your current properties table
      */}

      <input

        type="hidden"

        name="image_url"

        value={
          imageUrls[0] || ""
        }

      />





      {/* 
        Send all images as JSON
        for property_images table
      */}

      <input

        type="hidden"

        name="image_urls"

        value={
          JSON.stringify(imageUrls)
        }

      />






      <input
        name="total_value"
        type="number"
        placeholder="Property total value"
        className="w-full rounded-lg border p-3"
        required
      />





      <input
        name="minimum_investment"
        type="number"
        placeholder="Minimum investment"
        className="w-full rounded-lg border p-3"
        required
      />





      <input
        name="expected_roi"
        type="number"
        placeholder="Expected ROI %"
        className="w-full rounded-lg border p-3"
        required
      />





      <input
        name="funding_goal"
        type="number"
        placeholder="Funding goal"
        className="w-full rounded-lg border p-3"
        required
      />






      <button

        className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white"

      >

        Create Property

      </button>



    </form>

  );

}