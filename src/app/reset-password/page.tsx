"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function ResetPasswordPage() {


  const supabase = createClient();

  const router = useRouter();


  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [ready, setReady] =
    useState(false);





  useEffect(() => {


    async function checkSession(){


      const {
        data,
        error
      } =
      await supabase.auth.getSession();




      if(error || !data.session){

        toast.error(
          "Invalid or expired reset link. Please request a new password reset."
        );

        return;

      }



      setReady(true);


    }



    checkSession();


  }, [supabase]);








  async function handleUpdatePassword(

    e: React.FormEvent

  ){

    e.preventDefault();




    if(password !== confirmPassword){

      toast.error(
        "Passwords do not match"
      );

      return;

    }




    if(password.length < 6){

      toast.error(
        "Password must be at least 6 characters"
      );

      return;

    }





    setLoading(true);




    const {
      error
    } =
    await supabase.auth.updateUser({

      password

    });





    if(error){

      toast.error(
        error.message
      );

      setLoading(false);

      return;

    }





    toast.success(
      "Password updated successfully"
    );




    setTimeout(()=>{

      router.push("/login");

    },1500);



    setLoading(false);


  }







  return (

    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">


      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">


        <h1 className="text-2xl font-bold text-gray-900">

          Reset Password

        </h1>




        <p className="mt-2 text-gray-500">

          Create a new password for your Equiti Gate account.

        </p>





        {
          ready ?

          (

            <form

              onSubmit={handleUpdatePassword}

              className="mt-6 space-y-4"

            >


              <Input

                type="password"

                placeholder="New password"

                value={password}

                onChange={(e)=>
                  setPassword(e.target.value)
                }

                required

              />





              <Input

                type="password"

                placeholder="Confirm password"

                value={confirmPassword}

                onChange={(e)=>
                  setConfirmPassword(e.target.value)
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

                  "Updating..."

                  :

                  "Update Password"

                }


              </Button>




            </form>


          )

          :

          (

            <p className="mt-6 text-gray-500">

              Checking reset link...

            </p>

          )

        }



      </div>


    </main>

  );

}