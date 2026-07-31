"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export default function AdminSidebar(){


  const pathname = usePathname();



  const links = [

    {
      name:"Dashboard",
      href:"/admin",
      icon:"📊"
    },

    {
      name:"Properties",
      href:"/admin/properties",
      icon:"🏢"
    },

    {
      name:"Deposits",
      href:"/admin/deposits",
      icon:"💰"
    },

    {
      name:"Withdrawals",
      href:"/admin/withdrawals",
      icon:"⬇️"
    },

    {
      name:"Investments",
      href:"/admin/investments",
      icon:"📈"
    }

  ];





  return (

    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r p-6 shadow-sm">


      <h1 className="text-2xl font-bold text-emerald-700">

        EQUITI GATE

      </h1>


      <p className="mt-1 mb-8 text-sm text-gray-500">

        Admin Panel

      </p>




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

              {link.name}


            </Link>


          ))
        }


      </nav>



    </aside>

  );

}