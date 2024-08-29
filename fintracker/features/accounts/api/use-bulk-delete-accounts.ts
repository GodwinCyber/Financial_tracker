/**
 * Custom hook for bulk deleting accounts.
 * Utilizes React Query for mutation and client-side state management.
 * 
 * - **Mutation Function (`mutationFn`)**: Sends a POST request to the `bulk-delete` endpoint of the `accounts` API.
 * - **Success Handling (`onSuccess`)**: 
 *   - Displays a success toast notification.
 *   - Invalidates the `accounts` query to refresh the data.
 *   - TODO: Add invalidation for summary data if needed.
 * - **Error Handling (`onError`)**: Displays an error toast notification if the deletion fails.
 * 
 * **Usage**:
 * - Call `useBulkDeleteAccounts` to get access to the mutation function and its state.
 */

import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account deleted");
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            // TODO: Also invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete account");
        },
    });
    return mutation;
};
