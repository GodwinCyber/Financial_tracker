/**
 * Import necessary modules and components:
 * - useOpenAccount: Custom hook for handling the opening of account details.
 * 
 * Props Type:
 * - Defines the shape of the props for the AccountColumn component.
 * - account: The name or identifier of the account.
 * - accountId: The unique identifier for the account.
 * 
 * AccountColumn Component:
 * - Renders a clickable column that displays the account name.
 * - Uses the `useOpenAccount` hook to handle the click event and open account details.
 * - Applies styles to make the column interactive with a hover effect.
 **/

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

type Props = {
    account: string;
    accountId: string;
};

export const AccountColumn = ({
    account,
    accountId,
}: Props) => {
    const { onOpen: onOpenAccount } = useOpenAccount();

    const onClick = () => {
        onOpenAccount(accountId);
    };
    return (
        <div
          onClick={onClick}
          className="flex items-center cursor-pointer hover:underline"
        >
            {account}
        </div>
    );
};

