export type Investment = {
  id: number;
  userId: number;
  propertyName: string;
  location: string;
  investmentTier: string;
  amount: number;
  expectedReturn: string;
  status: string;
};


export const investments: Investment[] = [

  {
    id: 1,
    userId: 1,
    propertyName: "Dubai Short-Term Rental Project",
    location: "Dubai, UAE",
    investmentTier: "Growth Investor",
    amount: 50,
    expectedReturn: "12%",
    status: "Active",
  },


  {
    id: 2,
    userId: 1,
    propertyName: "Kampala Residential Development",
    location: "Kampala, Uganda",
    investmentTier: "Starter Investor",
    amount: 15,
    expectedReturn: "8%",
    status: "Active",
  },


  {
    id: 3,
    userId: 2,
    propertyName: "Global Holiday Homes",
    location: "Multiple Countries",
    investmentTier: "Premium Investor",
    amount: 150,
    expectedReturn: "15%",
    status: "Active",
  },


];