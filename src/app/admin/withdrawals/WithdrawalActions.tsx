"use client";


import { useState } from "react";
import { updateWithdrawalStatus } from "../actions/withdrawal-actions";


export default function WithdrawalActions({

id

}:{

id:string;

}){


const [loading,setLoading]=useState(false);



async function update(status:string){


setLoading(true);



await updateWithdrawalStatus(
  id,
  status
);



window.location.reload();


}




return (

<div className="mt-5 flex gap-3">


<button

disabled={loading}

onClick={()=>update("Approved")}

className="rounded-lg bg-emerald-700 px-5 py-2 text-white"

>

Approve

</button>




<button

disabled={loading}

onClick={()=>update("Rejected")}

className="rounded-lg bg-red-600 px-5 py-2 text-white"

>

Reject

</button>


</div>

);


}