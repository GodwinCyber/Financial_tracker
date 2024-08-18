"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export default function Home() {
  const { onOpen } = useNewAccount();

  return (
    <div>
      <Button onClick={onOpen}>
        Add an account
      </Button>
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
