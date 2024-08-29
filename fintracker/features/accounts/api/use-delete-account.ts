/**
 * Custom hook for deleting an account.
 * Uses React Query to manage the mutation state and perform side effects.
 * 
 * - **Mutation Function (`mutationFn`)**: Sends a DELETE request to the `accounts/:id` API endpoint to delete the specified account.
 * - **Success Handling (`onSuccess`)**:
 *   - Displays a success toast notification.
 *   - Invalidates queries for `account` (specific to the deleted account), `accounts` (list of all accounts), and `transactions` (related transactions) to ensure the UI reflects the latest data.
 * - **Error Handling (`onError`)**: Displays an error toast notification if account deletion fails.
 * 
 * **Usage**:
 * - Call `useDeleteAccount` with the account `id` to get access to the mutation function and its state.
 */

import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
      ResponseType,
      Error
    >({
        mutationFn: async () => {
            const response = await client.api.accounts[":id"]["$delete"]({
                param: { id },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account deleted");
            queryClient.invalidateQueries( { queryKey: ["account", { id }] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            //TODO: Inavlidate summary and transactions
        },
        onError: () => {
            toast.error("Failed to delete account");
        },
    });
    return mutation;
};
