"use client";

export default function Home() {
  return (
    <div>
      Home page
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
//   );
// };
