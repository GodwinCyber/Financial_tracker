/**
 * Custom hook for fetching a single account.
 * Uses React Query to manage fetching and caching of the account data.
 * 
 * - **Query Function (`queryFn`)**: Sends a GET request to the `accounts/:id` API endpoint to retrieve data for the specified account.
 *   - Throws an error if the request fails.
 *   - Parses the JSON response to extract the account data.
 * - **Query Configuration**:
 *   - **Enabled**: The query is only executed if `id` is truthy (`!!id`).
 *   - **Query Key**: `["account", { id }]` to uniquely identify the query and manage caching.
 * 
 * **Usage**:
 * - Call `useGetAccount` with the account `id` to get the query object, which includes `data`, `error`, `isLoading`, and other query state.
 */

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetAccount = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["account", { id }],
        queryFn: async () => {
            const response = await client.api.accounts[":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch account");
            }
            const { data } = await response.json();
            return data;
        },
    });
    return query;
};
