/**
 * Custom hook for creating an account.
 * Uses React Query to manage the mutation state and perform side effects.
 * 
 * - **Mutation Function (`mutationFn`)**: Sends a POST request to the `accounts` API endpoint for creating a new account.
 * - **Success Handling (`onSuccess`)**: 
 *   - Displays a success toast notification.
 *   - Invalidates the `accounts` query to ensure the data is refreshed.
 * - **Error Handling (`onError`)**: Displays an error toast notification if account creation fails.
 * 
 * **Usage**:
 * - Call `useCreateAccount` to get access to the mutation function and its state.
 */


import { toast } from "sonner"
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account Created");
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: () => {
            toast.error("Failed to create account");
        },
    });
    return mutation;
};
