import InvestorSidebar from "./InvestorSidebar";


export default function InvestorLayout({

children,

}:{

children: React.ReactNode;

}) {


return (

<div className="min-h-screen bg-gray-50">


<InvestorSidebar />



<main className="ml-64 p-8">


{children}


</main>



</div>

);


}