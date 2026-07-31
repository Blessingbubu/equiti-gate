"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function RegisterForm() {

  const supabase = createClient();

  const router = useRouter();


  const [loading, setLoading] =
    useState(false);


  const [formData, setFormData] =
    useState({

      full_name: "",
      country: "",
      phone: "",
      email: "",
      password: "",

    });





  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  }








  async function handleRegister(
    e: React.FormEvent
  ) {


    e.preventDefault();


    setLoading(true);





    // Create Auth Account

    const {

      data:authData,

      error:authError

    } =
    await supabase.auth.signUp({

      email:
        formData.email,

      password:
        formData.password,

    });








    if(authError){

      toast.error(
        authError.message
      );

      setLoading(false);

      return;

    }









    if(authData.user){


      // Create Profile

      const {

        error:profileError

      } =
      await supabase
        .from("profiles")
        .insert({

          id:
            authData.user.id,


          full_name:
            formData.full_name,


          country:
            formData.country,


          phone:
            formData.phone,


          role:
            "investor",

        });






      if(profileError){


        toast.error(
          profileError.message
        );


        setLoading(false);


        return;


      }



    }









    // Automatically login user

    const {

      error:loginError

    } =
    await supabase.auth.signInWithPassword({

      email:
        formData.email,


      password:
        formData.password,


    });







    if(loginError){


      toast.error(
        loginError.message
      );


      setLoading(false);


      return;


    }








    toast.success(
      "Account created successfully!"
    );








    setFormData({

      full_name: "",
      country: "",
      phone: "",
      email: "",
      password: "",

    });






    setLoading(false);





    router.push("/dashboard");


    router.refresh();



  }








  return (


    <form

      onSubmit={handleRegister}

      className="space-y-4 max-w-md"

    >




      <Input

        name="full_name"

        placeholder="Full Name"

        value={
          formData.full_name
        }

        onChange={handleChange}

        required

      />





      <Input

        name="country"

        placeholder="Country"

        value={
          formData.country
        }

        onChange={handleChange}

        required

      />





      <Input

        name="phone"

        placeholder="Phone Number"

        value={
          formData.phone
        }

        onChange={handleChange}

      />





      <Input

        name="email"

        type="email"

        placeholder="Email"

        value={
          formData.email
        }

        onChange={handleChange}

        required

      />





      <Input

        name="password"

        type="password"

        placeholder="Password"

        value={
          formData.password
        }

        onChange={handleChange}

        required

      />






      <Button

        type="submit"

        disabled={loading}

      >

        {

          loading

          ?

          "Creating account..."

          :

          "Create Account"

        }


      </Button>






    </form>


  );

}