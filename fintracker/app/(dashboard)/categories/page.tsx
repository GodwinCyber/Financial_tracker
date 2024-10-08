/**
 * Import necessary modules and components:
 * - Loader2, Plus: Icon components from lucide-react for loading animations and adding new items.
 * - columns: Configuration for table columns imported from the columns module.
 * - DataTable, Skeleton, Button, Card, CardHeader, CardTitle, CardContent: UI components for table display, loading states, buttons, and card layout.
 * 
 * Hook Imports:
 * - useNewCategory: Custom hook for handling new category creation.
 * - useBulkDeleteCategories: Custom hook for handling the deletion of multiple categories.
 * - useGetCategories: Custom hook for fetching categories data.
 * 
 * CategoriesPage Component:
 * - Renders the categories management page with a responsive layout.
 * - Displays a loading state while data is being fetched.
 * - Handles adding new categories and deleting selected categories.
 **/

"use client";

import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";



const CategoriesPage = () => {
    const newCategory = useNewCategory();
    const deleteCategories = useBulkDeleteCategories();
    const categoriesQuery = useGetCategories();
    const categories = categoriesQuery.data || [];

    const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

    if (categoriesQuery.isLoading) {
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
                        Categories Page
                    </CardTitle>
                    <Button onClick={newCategory.onOpen} size="sm">
                        <Plus className="size-4 mr-2"/>
                        Add New 
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                      filterKey="name"
                      columns={columns}
                      data={categories}
                      onDelete={(row) => {
                        const ids = row.map((r) => r.original.id);
                        deleteCategories.mutate({ ids });
                      }}
                      disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoriesPage;
