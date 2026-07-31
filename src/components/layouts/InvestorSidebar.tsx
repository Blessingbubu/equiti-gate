"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export default function InvestorSidebar() {


  const pathname = usePathname();


  const [unreadCount, setUnreadCount] = useState(0);



  useEffect(() => {


    async function getUnreadCount(){


      try {


        const response =
          await fetch("/api/notifications/unread");


        const data =
          await response.json();


        setUnreadCount(
          data.count || 0
        );


      } catch(error){


        console.error(
          "Unread notification error:",
          error
        );


      }


    }



    getUnreadCount();


  }, []);





  const links = [

    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "📊",
    },

    {
      name: "Properties",
      href: "/properties",
      icon: "🏢",
    },

    {
      name: "Investments",
      href: "/investments",
      icon: "📈",
    },

    {
      name: "Transactions",
      href: "/transactions",
      icon: "📜",
    },

    {
      name: "Wallet",
      href: "/wallet",
      icon: "💳",
    },

    {
      name: "Deposit",
      href: "/deposit",
      icon: "⬆️",
    },

    {
      name: "Withdraw",
      href: "/withdraw",
      icon: "⬇️",
    },

    {
      name: "Notifications",
      href: "/notifications",
      icon: "🔔",
    },

    {
      name: "Profile",
      href: "/profile",
      icon: "👤",
    },

  ];





  return (

    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white p-6 shadow-sm">


      <div className="mb-8">


        <h1 className="text-2xl font-bold text-emerald-700">

          EQUITI GATE

        </h1>


        <p className="text-sm text-gray-500">

          Investment Platform

        </p>


      </div>






      <nav className="space-y-2">


        {
          links.map((link)=>(


            <Link

              key={link.href}

              href={link.href}

              className={

                pathname === link.href

                ?

                "flex items-center gap-3 rounded-lg bg-emerald-700 px-4 py-3 text-white"

                :

                "flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100"

              }

            >


              <span>

                {link.icon}

              </span>



              <span>

                {link.name}

              </span>




              {
                link.href === "/notifications" &&
                unreadCount > 0 && (

                  <span className="ml-auto rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">

                    {unreadCount}

                  </span>

                )
              }



            </Link>


          ))
        }



      </nav>



    </aside>

  );

}