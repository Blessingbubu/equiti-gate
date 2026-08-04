import Link from "next/link";


export default function Navbar() {


  return (

    <nav
      className="
      sticky
      top-0
      z-50
      border-b
      border-gray-200
      bg-white/95
      backdrop-blur
      "
    >


      <div
        className="
        mx-auto
        flex
        max-w-7xl
        items-center
        justify-between
        px-8
        py-5
        "
      >





        {/* LOGO */}


        <Link
          href="/"
          className="
          flex
          items-center
          gap-3
          "
        >


          <div
            className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-emerald-700
            to-emerald-900
            text-xl
            font-black
            text-white
            shadow-lg
            "
          >

            EG

          </div>





          <div>


            <h1
              className="
              text-xl
              font-black
              tracking-tight
              text-gray-900
              "
            >

              Equiti Gates

            </h1>




            <p
              className="
              text-xs
              font-medium
              uppercase
              tracking-widest
              text-gray-500
              "
            >

              Global Real Estate Investment

            </p>


          </div>



        </Link>









        {/* MENU */}


        <div
          className="
          hidden
          items-center
          gap-9
          md:flex
          "
        >



          <NavLink
            href="/"
            text="Home"
          />



          <NavLink
            href="/properties"
            text="Properties"
          />



          <NavLink
            href="/how-it-works"
            text="How It Works"
          />



          <NavLink
            href="/about"
            text="About"
          />



        </div>









        {/* ACTIONS */}


        <div
          className="
          hidden
          items-center
          gap-5
          md:flex
          "
        >


          <Link

            href="/login"

            className="
            text-sm
            font-semibold
            text-gray-700
            transition
            hover:text-emerald-700
            "

          >

            Login

          </Link>





          <Link

            href="/invest"

            className="
            rounded-xl
            bg-emerald-700
            px-7
            py-3
            text-sm
            font-bold
            text-white
            shadow-lg
            transition
            hover:-translate-y-0.5
            hover:bg-emerald-800
            "

          >

            Start Investing

          </Link>



        </div>





      </div>


    </nav>


  );

}









function NavLink({
  href,
  text,
}: {
  href:string;
  text:string;
}) {


  return (

    <Link

      href={href}

      className="
      relative
      text-sm
      font-semibold
      text-gray-700
      transition
      hover:text-emerald-700
      "

    >

      {text}

    </Link>

  );

}