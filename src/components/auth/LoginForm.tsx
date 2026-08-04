"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {

  const supabase = createClient();

  const router = useRouter();


  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({

    email: "",

    password: "",

  });



  function handleChange(

    e: React.ChangeEvent<HTMLInputElement>

  ) {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  }





  async function handleLogin(

    e: React.FormEvent

  ) {

    e.preventDefault();


    setLoading(true);



    const {

      error,

    } = await supabase.auth.signInWithPassword({

      email: formData.email,

      password: formData.password,

    });




    if (error) {

      toast.error(error.message);

      setLoading(false);

      return;

    }





    toast.success("Login successful!", {

      description:

        "Welcome back to Equiti Gates.",

    });



    router.push("/dashboard");



    setLoading(false);

  }





  return (

    <form

      onSubmit={handleLogin}

      className="space-y-4"

    >


      <Input

        name="email"

        type="email"

        placeholder="Email"

        value={formData.email}

        onChange={handleChange}

        required

      />





      <Input

        name="password"

        type="password"

        placeholder="Password"

        value={formData.password}

        onChange={handleChange}

        required

      />






      <div className="text-right">

        <Link

          href="/forgot-password"

          className="text-sm text-emerald-700 hover:underline"

        >

          Forgot Password?

        </Link>

      </div>







      <Button

        type="submit"

        disabled={loading}

        className="w-full"

      >

        {loading

          ? "Logging in..."

          : "Login"}

      </Button>



    </form>

  );

}