/**
 * Custom hook for fetching all accounts.
 * Uses React Query to manage fetching and caching of the accounts data.
 * 
 * - **Query Function (`queryFn`)**: Sends a GET request to the `accounts` API endpoint to retrieve the list of all accounts.
 *   - Throws an error if the request fails.
 *   - Parses the JSON response to extract the accounts data.
 * - **Query Configuration**:
 *   - **Query Key**: `["accounts"]` to uniquely identify the query and manage caching.
 * 
 * **Usage**:
 * - Call `useGetAccounts` to get the query object, which includes `data`, `error`, `isLoading`, and other query state.
 */


import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetAccounts = () => {
    const query = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const response = await client.api.accounts.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch accounts");
            }
            const { data } = await response.json();
            return data;
        },
    });
    return query;
};
