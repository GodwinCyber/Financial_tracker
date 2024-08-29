/**
 * Custom hook for editing an account.
 * Uses React Query to manage the mutation state and perform side effects.
 * 
 * - **Mutation Function (`mutationFn`)**: Sends a PATCH request to the `accounts/:id` API endpoint to update the specified account with new data.
 * - **Success Handling (`onSuccess`)**:
 *   - Displays a success toast notification.
 *   - Invalidates queries for `account` (specific to the updated account), `accounts` (list of all accounts), and `transactions` (related transactions) to ensure the UI reflects the latest data.
 * - **Error Handling (`onError`)**: Displays an error toast notification if account update fails.
 * 
 * **Usage**:
 * - Call `useEditAccount` with the account `id` to get access to the mutation function and its state.
 */

import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({
                json,
                param: { id },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account updated");
            queryClient.invalidateQueries( { queryKey: ["account", { id }] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            //TODO: Inavlidate summary and transactions
        },
        onError: () => {
            toast.error("Failed to create account");
        },
    });
    return mutation;
};
