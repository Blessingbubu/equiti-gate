export type User = {
  id: number;
  fullName: string;
  email: string;
  country: string;
  phone: string;
  accountStatus: string;
};


export const users: User[] = [

  {
    id: 1,
    fullName: "John Investor",
    email: "john@example.com",
    country: "Uganda",
    phone: "+256700000000",
    accountStatus: "Active",
  },


  {
    id: 2,
    fullName: "Sarah Property",
    email: "sarah@example.com",
    country: "UAE",
    phone: "+971500000000",
    accountStatus: "Active",
  },


];