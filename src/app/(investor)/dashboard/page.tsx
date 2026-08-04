import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { checkInvestmentMaturity } from "@/lib/investment/checkMaturity";
import { settleCompletedInvestments } from "@/lib/investment/settleInvestment";



function Card({
  title,
  value,
}: {
  title:string;
  value:string | number;
}) {

  return (

    <div className="rounded-2xl bg-white p-6 shadow">

      <p className="text-sm text-gray-500">
        {title}
      </p>


      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

    </div>

  );

}





export default async function DashboardPage(){


  const supabase =
    await createClient();





  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();





  if(!user){

    redirect("/login");

  }





  console.log(
  "RUNNING INVESTMENT ENGINE"
);


await checkInvestmentMaturity(
  user.id
);


console.log(
  "MATURITY CHECK FINISHED"
);


await settleCompletedInvestments(
  user.id
);


console.log(
  "SETTLEMENT CHECK FINISHED"
);






  const {
    data:profile
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
    data:investments
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
    data:wallet
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
    data:transactions
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

        total +
        Number(
          item.amount || 0
        ),

      0

    ) || 0;







  const activeInvestments =

    investments?.filter(

      item =>
      item.status === "Active"

    ).length || 0;







  const portfolioValue =

    totalInvested;







  const expectedProfit =

    investments?.reduce(

      (total,item)=>

        total +

        Number(
          item.total_expected_profit || 0
        ),

      0

    ) || 0;







  const totalProfitPaid =

    investments?.reduce(

      (total,item)=>

        total +

        Number(
          item.profit_paid || 0
        ),

      0

    ) || 0;







  const weeklyIncome =

    investments?.reduce(

      (total,item)=>

        total +

        Number(
          item.weekly_profit || 0
        ),

      0

    ) || 0;







return (

<main className="min-h-screen bg-gray-50">

<div className="mx-auto max-w-7xl space-y-8">



<section className="
overflow-hidden
rounded-3xl
bg-gradient-to-r
from-emerald-950
via-emerald-900
to-emerald-700
p-10
text-white
shadow-xl
">


<div className="
flex
flex-col
gap-8
lg:flex-row
lg:items-end
lg:justify-between
">


<div>


<p className="
mb-3
text-xs
font-semibold
uppercase
tracking-[0.35em]
text-emerald-200/80
">

Investor Dashboard

</p>



<h1 className="
text-4xl
font-black
sm:text-5xl
">

Welcome,
{profile?.full_name || "Investor"}

</h1>



<p className="
mt-4
max-w-2xl
text-lg
text-emerald-100
">

Track your real estate portfolio,
weekly returns and locked capital.

</p>




<div className="mt-6 flex gap-4">


<Link

href="/properties"

className="
rounded-xl
bg-emerald-600
px-6
py-3
font-semibold
"

>

Explore Properties

</Link>



</div>


</div>


</div>


</section>




<section className="
grid
gap-6
md:grid-cols-3
lg:grid-cols-6
">


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

title="Weekly Profit"

value={`$${weeklyIncome.toFixed(2)}`}

/>


</section>









<section className="
grid
gap-5
md:grid-cols-3
">


<Link

href="/deposit"

className="
rounded-xl
bg-emerald-700
p-5
text-center
text-white
shadow
"

>

⬆ Deposit Funds

</Link>





<Link

href="/withdraw"

className="
rounded-xl
bg-white
p-5
text-center
shadow
"

>

⬇ Withdraw Profits

</Link>





<Link

href="/properties"

className="
rounded-xl
bg-white
p-5
text-center
shadow
"

>

🏢 Explore Properties

</Link>



</section>









<section className="
rounded-xl
bg-white
p-8
shadow
">


<div className="
flex
justify-between
">


<h2 className="
text-2xl
font-bold
">

My Investments

</h2>



<Link

href="/investments"

className="
text-emerald-700
"

>

View All

</Link>


</div>








<div className="
mt-6
space-y-5
">


{

investments &&
investments.length > 0

?

investments.slice(0,3).map((investment)=>(



<div

key={investment.id}

className="
rounded-xl
border
p-6
"

>


<div className="
flex
justify-between
items-start
">


<div>


<h3 className="
text-xl
font-bold
">

{investment.property_name}

</h3>



<p className="
mt-2
text-gray-500
">

📍 {investment.location}

</p>


</div>




<span className="
rounded-full
bg-emerald-100
px-4
py-1
text-sm
font-semibold
text-emerald-700
">

{investment.status}

</span>


</div>








<div className="
mt-6
grid
gap-5
md:grid-cols-4
">


<div>

<p className="text-gray-500">

Investment

</p>


<strong>

${Number(
investment.amount || 0
).toFixed(2)}

</strong>

</div>






<div>

<p className="text-gray-500">

Plan

</p>


<strong>

{investment.investment_plan}

</strong>


</div>






<div>

<p className="text-gray-500">

Monthly ROI

</p>


<strong className="text-emerald-700">

{investment.monthly_roi}%

</strong>


</div>






<div>

<p className="text-gray-500">

Weekly Profit

</p>


<strong>

${Number(
investment.weekly_profit || 0
).toFixed(2)}

</strong>


</div>


</div>









<div className="
mt-5
grid
gap-5
md:grid-cols-4
">


<div>

<p className="text-gray-500">

Profit Received

</p>


<strong className="text-emerald-700">

$
{Number(
investment.profit_paid || 0
).toFixed(2)}

</strong>


</div>





<div>

<p className="text-gray-500">

Total Expected Profit

</p>


<strong>

$
{Number(
investment.total_expected_profit || 0
).toFixed(2)}

</strong>


</div>






<div>

<p className="text-gray-500">

Principal Status

</p>


<strong>

🔒 {investment.principal_status}

</strong>


</div>






<div>

<p className="text-gray-500">

Next Payment

</p>


<strong>

{

investment.next_profit_date

?

new Date(
investment.next_profit_date
).toLocaleDateString()

:

"N/A"

}

</strong>


</div>


</div>








<Link

href={`/investments/${investment.id}`}

className="
mt-6
inline-block
rounded-lg
bg-emerald-700
px-5
py-2
text-white
"

>

View Details

</Link>



</div>



))


:

<p className="text-gray-500">

No investments yet.

</p>


}


</div>


</section>









<section className="
rounded-xl
bg-white
p-8
shadow
">


<h2 className="
text-2xl
font-bold
">

Recent Activity

</h2>





<div className="
mt-5
space-y-4
">


{

transactions?.length

?

transactions.map((transaction)=>(


<div

key={transaction.id}

className="
flex
justify-between
border-b
pb-3
"

>


<div>


<p className="font-semibold">

{transaction.description || transaction.type}

</p>


<p className="text-sm text-gray-500">

{
new Date(
transaction.created_at
).toLocaleDateString()
}

</p>


</div>




<strong>

$
{Number(
transaction.amount || 0
).toFixed(2)}

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
