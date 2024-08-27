/**
 * Import necessary modules and components:
 * - Button: Custom button component from the UI library.
 * - Edit, MoreHorizontal, Trash: Icon components from lucide-react for various actions.
 * - useOpenCategory: Hook to handle the opening of a category for editing.
 * - useDeleteCategory: Hook to handle the deletion of a category.
 * - useConfirm: Hook to display a confirmation dialog before performing an action.
 * - DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger: Components for creating a dropdown menu.
 * 
 * Actions Component:
 * - Provides a dropdown menu with options to edit or delete a category.
 * - Includes a confirmation dialog before deleting a category.
 **/

"use client";

import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";

import { useConfirm } from "@/hooks/use-confirm";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Props = {
    id: string;
};

export const Actions = ({ id }: Props) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Do you want to delete this!?",
        "This category is about to be deleted!"
    )
    const deleteMutation = useDeleteCategory(id);
    const { onOpen } = useOpenCategory();

    const handleDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate();
        }
    };
    return (
        <>
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="siz-8 p-0">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      disabled={deleteMutation.isPending}
                      onClick={() => onOpen(id)}
                    >
                        <Edit className="size-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={deleteMutation.isPending}
                      onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
