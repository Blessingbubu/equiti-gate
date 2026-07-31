import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-gray-900">

        <section className="bg-emerald-50 px-8 py-20 text-center">
          <h1 className="mx-auto max-w-4xl text-5xl font-bold">
            Building Global Wealth Through Real Estate
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Equiti Gate connects people worldwide with real estate investment
            opportunities through collective property development.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white">
              Start Investing
            </button>

            <button className="rounded-lg border border-emerald-700 px-6 py-3 font-semibold text-emerald-700">
              Learn More
            </button>
          </div>
        </section>


        <section className="px-8 py-16">
          <h2 className="text-center text-3xl font-bold">
            Investment Plans
          </h2>

          <div className="mx-auto mt-10 grid max-w-6xl gap-8 md:grid-cols-3">

            <InvestmentCard
              title="Tier 1"
              amount="$15"
              roi="8% ROI"
            />

            <InvestmentCard
              title="Tier 2"
              amount="$50"
              roi="12% ROI"
            />

            <InvestmentCard
              title="Tier 3"
              amount="$150"
              roi="15% ROI"
            />

          </div>
        </section>


        <section className="bg-gray-100 px-8 py-16 text-center">
          <h2 className="text-3xl font-bold">
            How Equiti Gate Works
          </h2>

          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-4">

            <Step number="1" text="Create Account" />
            <Step number="2" text="Choose Investment" />
            <Step number="3" text="Track Rewards" />
            <Step number="4" text="Receive Returns" />

          </div>
        </section>


        <section className="px-8 py-16 text-center">
          <h2 className="text-3xl font-bold">
            Investing Together. Building Worldwide.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-gray-600">
            Our mission is to make real estate investment accessible by
            allowing people to participate in global property projects.
          </p>
        </section>


        <footer className="border-t px-8 py-6 text-center text-gray-500">
          © {new Date().getFullYear()} Equiti Gate
        </footer>

      </main>
    </>
  );
}


function InvestmentCard({
  title,
  amount,
  roi,
}: {
  title: string;
  amount: string;
  roi: string;
}) {
  return (
    <div className="rounded-xl border p-8 shadow-sm">
      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="mt-4 text-4xl font-bold">
        {amount}
      </p>

      <p className="mt-4 text-emerald-700 font-semibold">
        {roi}
      </p>

      <p className="mt-3 text-gray-600">
        Participate in Equiti Gate real estate projects.
      </p>
    </div>
  );
}


function Step({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div>
      <div className="text-2xl font-bold text-emerald-700">
        {number}
      </div>

      <p className="mt-2 text-gray-600">
        {text}
      </p>
    </div>
  );
}