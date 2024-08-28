
import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export default function DashboardPage() {

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
  );
};


// import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

// export default function Home() {
//   const { data: accounts, isLoading } = useGetAccounts();

//   if (isLoading) {
//     return (
//       <div>
//         Loading....
//       </div>
//     );
//   }
//   return (
//     <div>
//       {accounts?.map((accounts) => (
//         <div key={accounts.id}>
//           {accounts.name}
//         </div>
//       ))}
//     </div>
//   );;

// };
