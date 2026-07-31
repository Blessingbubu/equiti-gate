"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";


export default function ForgotPasswordPage() {


  const supabase = createClient();


  const [email, setEmail] =
    useState("");


  const [loading, setLoading] =
    useState(false);





  async function handleReset(

    e: React.FormEvent

  ) {

    e.preventDefault();


    setLoading(true);




    const {

      error

    } =
    await supabase.auth.resetPasswordForEmail(

      email,

      {

        redirectTo:

          `${window.location.origin}/reset-password`

      }

    );





    if(error){

      toast.error(
        error.message
      );

      setLoading(false);

      return;

    }





    toast.success(

      "Password reset email sent. Check your inbox."

    );



    setLoading(false);

  }





  return (

    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">


      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">


        <h1 className="text-2xl font-bold text-gray-900">

          Forgot Password?

        </h1>



        <p className="mt-2 text-gray-500">

          Enter your email address and we will send you a password reset link.

        </p>





        <form

          onSubmit={handleReset}

          className="mt-6 space-y-4"

        >



          <Input

            type="email"

            placeholder="Email address"

            value={email}

            onChange={(e)=>
              setEmail(e.target.value)
            }

            required

          />





          <Button

            type="submit"

            disabled={loading}

            className="w-full"

          >

            {

              loading

              ?

              "Sending..."

              :

              "Send Reset Link"

            }


          </Button>



        </form>





        <div className="mt-5 text-center">


          <Link

            href="/login"

            className="text-sm text-emerald-700 hover:underline"

          >

            Back to Login

          </Link>


        </div>



      </div>


    </main>

  );

}