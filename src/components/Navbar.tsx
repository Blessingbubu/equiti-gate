import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b bg-white px-8 py-6">

      <div className="text-2xl font-bold text-emerald-700">
        <Link href="/">
          Equiti Gate
        </Link>
      </div>


      <div className="hidden gap-8 md:flex">

        <Link
          href="/"
          className="hover:text-emerald-700"
        >
          Home
        </Link>


        <Link
          href="/invest"
          className="hover:text-emerald-700"
        >
          Invest
        </Link>


        <Link
          href="/properties"
          className="hover:text-emerald-700"
        >
          Properties
        </Link>


        <Link
          href="/login"
          className="hover:text-emerald-700"
        >
          Login
        </Link>


        <Link
          href="/register"
          className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
        >
          Get Started
        </Link>

      </div>

    </nav>
  );
}