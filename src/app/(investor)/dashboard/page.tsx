import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { checkInvestmentMaturity } from "@/lib/investment/checkMaturity";
import { settleCompletedInvestments } from "@/lib/investment/settleInvestment";


export default async function DashboardPage() {


  const supabase = await createClient();



  const {
    data:{
      user,
    },
  } =
  await supabase.auth.getUser();



  if(!user){

    redirect("/login");

  }
  
 // Update matured investments
await checkInvestmentMaturity(user.id);

// Settle completed investments
await settleCompletedInvestments(user.id);

// Refresh Supabase data after updates
const supabaseFresh = await createClient();




  const {
    data:profile,
  } =
  await supabase
    .from("profiles")
    .select("*")
    .eq(
      "id",
      user.id
    )
    .single();







  const {
    data:investments,
  } =
  await supabase
    .from("investments")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );







  const {
    data:wallet,
  } =
  await supabase
    .from("wallets")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .single();








  const {
    data:transactions,
  } =
  await supabase
    .from("transactions")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    )
    .limit(5);









  const totalInvested =
    investments?.reduce(
      (total,item)=>
        total + Number(item.amount || 0),
      0
    ) || 0;






  const activeInvestments =
    investments?.filter(
      item =>
        item.status === "Active"
    ).length || 0;







  const portfolioValue =
    investments?.reduce(
      (total,item)=>
        total +
        Number(item.amount || 0),
      0
    ) || 0;







  const expectedProfit =
    investments?.reduce(
      (total,item)=>
        total +
        (
          Number(item.total_return || 0)
          -
          Number(item.amount || 0)
        ),
      0
    ) || 0;







  const accumulatedProfit =
  investments?.reduce(
    (total, item) => {

      if (
        item.status !== "Active" ||
        !item.start_date
      ) {
        return total;
      }


      const startDate =
        new Date(item.start_date);


      const today =
        new Date();


      const daysPassed =
        Math.floor(
          (
            today.getTime()
            -
            startDate.getTime()
          )
          /
          (
            1000 *
            60 *
            60 *
            24
          )
        );


      const earned =
        Math.min(
          daysPassed,
          item.duration_days || 14
        )
        *
        Number(
          item.daily_profit || 0
        );


      return total + earned;

    },
    0
  ) || 0;







  const dailyIncome =
    investments?.reduce(
      (total,item)=>
        total +
        Number(item.daily_profit || 0),
      0
    ) || 0;









  return (


<main className="min-h-screen bg-gray-50">



<div className="mx-auto max-w-7xl space-y-8">








<section className="rounded-xl bg-white p-8 shadow">


<h1 className="text-3xl font-bold">

Welcome, {profile?.full_name || "Investor"}

</h1>



<p className="mt-2 text-gray-500">

Manage your Equiti Gate portfolio.

</p>



</section>









<section className="grid gap-6 md:grid-cols-6">



<Card
title="Wallet Balance"
value={`$${Number(wallet?.balance || 0).toFixed(2)}`}
/>



<Card
title="Total Invested"
value={`$${totalInvested.toFixed(2)}`}
/>



<Card
title="Active Investments"
value={activeInvestments}
/>



<Card
title="Portfolio Value"
value={`$${portfolioValue.toFixed(2)}`}
/>



<Card
title="Expected Profit"
value={`$${expectedProfit.toFixed(2)}`}
/>



<Card
title="Daily Income"
value={`$${dailyIncome.toFixed(2)}`}
/>



</section>









<section className="grid gap-5 md:grid-cols-3">


<Link
href="/deposit"
className="rounded-xl bg-emerald-700 p-5 text-center text-white shadow"
>

⬆ Deposit Funds

</Link>




<Link
href="/withdraw"
className="rounded-xl bg-white p-5 text-center shadow"
>

⬇ Withdraw

</Link>





<Link
href="/properties"
className="rounded-xl bg-white p-5 text-center shadow"
>

🏢 Explore Properties

</Link>



</section>









<section className="rounded-xl bg-white p-8 shadow">


<div className="flex justify-between">


<h2 className="text-2xl font-bold">

My Investments

</h2>



<Link
href="/investments"
className="text-emerald-700"
>

View All

</Link>



</div>






<div className="mt-6 space-y-5">

<div className="mt-6 space-y-5">

{
investments && investments.length > 0

?

investments.slice(0,3).map((investment)=>{


  const maturityDate =
    new Date(investment.start_date);


  maturityDate.setDate(
    maturityDate.getDate()
    +
    Number(investment.duration_days || 14)
  );


  const daysActive =
    Math.floor(
      (
        new Date().getTime()
        -
        new Date(investment.start_date).getTime()
      )
      /
      (
        1000 *
        60 *
        60 *
        24
      )
    );


  const earned =
    Math.min(
      daysActive,
      investment.duration_days || 14
    )
    *
    Number(
      investment.daily_profit || 0
    );


  return (

<div
key={investment.id}
className="rounded-xl border p-6"
>


<div className="flex justify-between">

<h3 className="text-xl font-bold">

{investment.property_name}

</h3>


<span className="text-emerald-700">

● {investment.status}

</span>


</div>



<p className="mt-2 text-gray-500">

📍 {investment.location}

</p>




<div className="mt-4 grid md:grid-cols-6 gap-4">


<div>

<p className="text-gray-500">
Amount
</p>

<strong>
${Number(investment.amount).toFixed(2)}
</strong>

</div>




<div>

<p className="text-gray-500">
ROI
</p>

<strong>
{investment.roi_percentage || 0}%
</strong>

</div>





<div>

<p className="text-gray-500">
Return
</p>

<strong>
${Number(investment.total_return || 0).toFixed(2)}
</strong>

</div>





<div>

<p className="text-gray-500">
Earned So Far
</p>

<strong className="text-emerald-700">

${earned.toFixed(2)}

</strong>

</div>





<div>

<p className="text-gray-500">
Daily Profit
</p>

<strong>
${Number(investment.daily_profit || 0).toFixed(2)}
</strong>

</div>





<div>

<p className="text-gray-500">
Maturity
</p>

<strong>

{maturityDate.toLocaleDateString()}

</strong>

</div>




</div>





<Link
href={`/investments/${investment.id}`}
className="mt-5 inline-block rounded-lg bg-emerald-700 px-5 py-2 text-white"
>

View Details

</Link>



</div>


);


})


:

<p className="text-gray-500">

No investments yet.

</p>


}


</div>
</div>



</section>









<section className="rounded-xl bg-white p-8 shadow">


<h2 className="text-2xl font-bold">

Recent Activity

</h2>





<div className="mt-5 space-y-4">


{

transactions?.length

?

transactions.map((transaction)=>(


<div
key={transaction.id}
className="flex justify-between border-b pb-3"
>


<div>


<p className="font-semibold">

{transaction.description || transaction.type}

</p>


<p className="text-sm text-gray-500">

{new Date(
transaction.created_at
).toLocaleDateString()}

</p>


</div>



<strong>

${Number(transaction.amount).toFixed(2)}

</strong>



</div>


))


:

<p className="text-gray-500">

No recent activity.

</p>


}



</div>


</section>








</div>


</main>


  );

}







function Card({

title,
value

}:{

title:string;
value:string|number;

}){


return (

<div className="rounded-xl bg-white p-6 shadow">


<p className="text-gray-500">

{title}

</p>


<h2 className="mt-3 text-3xl font-bold">

{value}

</h2>


</div>

);


}