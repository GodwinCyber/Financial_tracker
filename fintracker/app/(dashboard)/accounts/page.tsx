/** 
 * Import necessary modules and components:
 * - Button: Custom button component from the UI library.
 * - Card, CardHeader, CardTitle, CardContent: Components from the UI library to structure the card layout.
 * - useNewAccount: Hook to handle the creation of a new account.
 * - Loader2, Plus: Icon components from lucide-react for loading indicators and adding new items.
 * - columns: Predefined columns for the data table.
 * - DataTable: Custom data table component for displaying accounts.
 * - useGetAccounts: Hook to fetch account data from the API.
 * - Skeleton: Component to display a loading skeleton while data is being fetched.
 * - useBulkDeleteAccounts: Hook to handle bulk deletion of accounts.
 * 
 * AccountsPage Component:
 * - Renders a page for managing accounts.
 * - Displays a loading state while account data is being fetched.
 * - Provides functionality to add a new account and delete selected accounts.
 **/


"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";


const AccountsPage = () => {
    const newAccount = useNewAccount();
    const deleteAccounts = useBulkDeleteAccounts();
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

    if (accountsQuery.isLoading) {
        return (
            <div className="max-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48"/>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px w-full flex items.center justify-center">
                            <Loader2 className="size-8 text-slate-300 animate-spin "/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
    return (
        <div className="max-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Accounts Page
                    </CardTitle>
                    <Button onClick={newAccount.onOpen} size="sm">
                        <Plus className="size-4 mr-2"/>
                        Add New 
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                      filterKey="name"
                      columns={columns}
                      data={accounts}
                      onDelete={(row) => {
                        const ids = row.map((r) => r.original.id);
                        deleteAccounts.mutate({ ids });
                      }}
                      disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountsPage;
