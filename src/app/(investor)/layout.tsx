import InvestorLayout from "@/components/layouts/InvestorLayout";


export default function Layout({

children,

}:{

children: React.ReactNode;

}){


return (

<InvestorLayout>

{children}

</InvestorLayout>

);


}