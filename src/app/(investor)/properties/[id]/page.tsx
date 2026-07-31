import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("PROPERTY DETAILS PAGE LOADED", id);

  const supabase = await createClient();

  const {
    data: property,
    error,
  } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();


  if (error || !property) {
    console.log("Property fetch error:", error);
    notFound();
  }


  const progress =
    property.funding_goal > 0
      ? Math.min(
          (property.amount_raised /
            property.funding_goal) *
            100,
          100
        )
      : 0;


  return (
    <main className="min-h-screen bg-gray-50 px-8 py-10">

      <section className="rounded-xl bg-white p-8 shadow-sm">

        {property.image_url && (
          <img
            src={property.image_url}
            alt={property.title}
            className="h-96 w-full rounded-xl object-cover"
          />
        )}


        <h1 className="mt-8 text-4xl font-bold">
          {property.title}
        </h1>


        <p className="mt-3 text-gray-600">
          {property.city}, {property.country}
        </p>


        <p className="mt-6 text-gray-700">
          {property.description}
        </p>

      </section>



      <section className="mt-8 grid gap-6 md:grid-cols-3">


        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Property Value
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            ${property.total_value}
          </h2>
        </div>



        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Expected ROI
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-700">
            {property.expected_roi}%
          </h2>
        </div>



        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Minimum Investment
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            ${property.minimum_investment}
          </h2>
        </div>


      </section>



      <section className="mt-8 rounded-xl bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">
          Funding Progress
        </h2>


        <div className="mt-5 flex justify-between text-gray-600">

          <span>
            Raised
          </span>

          <span>
            ${property.amount_raised} /
            ${property.funding_goal}
          </span>

        </div>


        <div className="mt-3 h-3 rounded-full bg-gray-200">

          <div
            className="h-3 rounded-full bg-emerald-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>



        <Link
          href={`/invest/${property.id}`}
          className="mt-8 block rounded-lg bg-emerald-700 py-4 text-center text-white"
        >
          Invest Now
        </Link>


      </section>


    </main>
  );
}