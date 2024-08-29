
/**
 * DashboardPage Component:
 * - This component serves as the main dashboard page.
 * - It imports and displays two main components: DataGrid and DataCharts.
 * - The layout is centered on the screen with a maximum width of 2xl, includes padding at the bottom, 
 *   and pulls the content upwards using negative margin for alignment.
 **/

import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";

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
