import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InvestmentActions from "../components/InvestmentActions";

export default async function AdminPage() {

  const supabase = await createClient();


  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();


  if (!user) {
    redirect("/login");
  }



  const {
    data: profile,
  } = await supabase
    .from("profiles")
    .select("*")
    .eq(
      "id",
      user.id
    )
    .single();



  if (
    !profile ||
    profile.role !== "admin"
  ) {

    redirect("/dashboard");

  }



  const {
    data: investors,
  } = await supabase
    .from("profiles")
    .select("*")
    .eq(
      "role",
      "investor"
    );




  const {
    data: properties,
  } = await supabase
    .from("properties")
    .select("*");





  const {
    data: investments,
  } = await supabase
    .from("investments")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false
      }
    );





  const totalInvested =
    investments?.reduce(
      (total, investment) =>
        total + Number(investment.amount),
      0
    ) || 0;




  const pendingInvestments =
    investments?.filter(
      (investment) =>
        investment.status === "Pending"
    ) || [];





  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="mx-auto max-w-7xl">



        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Equiti Gates Admin
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome {profile.full_name}
          </p>

        </div>





        <section className="grid gap-6 md:grid-cols-4">



          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Total Investors
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {investors?.length || 0}
            </h2>

          </div>




          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Properties
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {properties?.length || 0}
            </h2>

          </div>




          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Total Investments
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              ${totalInvested}
            </h2>

          </div>




          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Pending Approvals
            </p>

            <h2 className="mt-3 text-3xl font-bold text-orange-500">
              {pendingInvestments.length}
            </h2>

          </div>


        </section>






        <section className="mt-10 rounded-xl bg-white p-8 shadow">


          <h2 className="mb-6 text-2xl font-bold">
            Investment Requests
          </h2>




          <div className="space-y-5">


          {investments?.map((investment)=>(


            <div
              key={investment.id}
              className="rounded-lg border p-5"
            >



              <h3 className="text-xl font-bold">
                {investment.property_name}
              </h3>



              <p className="mt-2 text-gray-600">
                Location: {investment.location}
              </p>



              <p className="text-gray-600">
                Amount: ${investment.amount}
              </p>



              <p className="text-gray-600">
                Expected Return: {investment.expected_return}
              </p>



              <p className={
                investment.status === "Pending"
                ? "text-orange-600"
                : "text-emerald-700"
              }>

                Status: {investment.status}

              </p>




              {investment.status === "Pending" && (

                <InvestmentActions
                  investmentId={investment.id}
                />

              )}




            </div>


          ))}



          </div>



        </section>




      </div>


    </main>

  );

}