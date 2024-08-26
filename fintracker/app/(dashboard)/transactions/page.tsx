"use client";

import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";

import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";

import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { useState } from "react";


import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    error: [],
    meta: {},
};


const TransactionsPage = () => {
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        console.log({ results });
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    };

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    }

    const newTransaction = useNewTransaction();
    const deleteTransactions = useBulkDeleteTransactions();
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

    if (transactionsQuery.isLoading) {
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
        );
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <ImportCard 
                  data={importResults.data}
                  onCancel={onCancelImport}
                  onSubmit={() => {}} 
                />
            </>
        );
    }

    return (
        <div className="max-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction History
                    </CardTitle>
                    <div className="flex items-center gap-x-2">
                        <Button onClick={newTransaction.onOpen} size="sm">
                            <Plus className="size-4 mr-2"/>
                            Add New 
                        </Button>
                        <UploadButton onUpload={onUpload}/>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                      filterKey="payee"
                      columns={columns}
                      data={transactions}
                      onDelete={(row) => {
                        const ids = row.map((r) => r.original.id);
                        deleteTransactions.mutate({ ids });
                      }}
                      disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionsPage;
