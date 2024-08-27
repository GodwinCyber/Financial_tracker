/**
 * Import necessary modules and components:
 * - useConfirm: Custom hook for displaying a confirmation dialog.
 * - useOpenTransaction: Custom hook for handling the opening of transaction details.
 * - useDeleteTransaction: Custom hook for handling transaction deletion.
 * - Button: Component for rendering buttons.
 * - Edit, MoreHorizontal, Trash: Icon components from lucide-react.
 * - DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger: Components for rendering dropdown menus.
 * 
 * Props Type:
 * - Defines the shape of the props for the Actions component.
 * - id: The unique identifier for the transaction.
 * 
 * Actions Component:
 * - Renders a dropdown menu with options to edit or delete a transaction.
 * - Uses `useConfirm` to handle confirmation for deleting a transaction.
 * - Uses `useDeleteTransaction` to perform the deletion.
 * - Uses `useOpenTransaction` to handle opening transaction details.
 * - Applies styles to make the dropdown menu interactive and aligned correctly.
 **/

"use client";

import { useConfirm } from "@/hooks/use-confirm";

import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";

import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

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
        "This transaction is about to be deleted!"
    )
    const deleteMutation = useDeleteTransaction(id);
    const { onOpen } = useOpenTransaction();

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
