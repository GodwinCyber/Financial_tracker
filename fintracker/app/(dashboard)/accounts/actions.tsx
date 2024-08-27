/** 
 * Import necessary modules and components:
 * - Button: Custom button component from the UI library.
 * - useOpenAccount: Hook to handle opening an account editing form.
 * - DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger: Components for creating a dropdown menu from the UI library.
 * - Edit, MoreHorizontal, Trash: Icon components from lucide-react for visual elements.
 * - useDeleteAccount: Hook to handle the deletion of an account.
 * - useConfirm: Hook to display a confirmation dialog before performing an action.
 * 
 * Actions Component:
 * - Renders a dropdown menu with options to edit or delete an account.
 * - Includes confirmation before deletion and handles the deletion process.
 **/

"use client";

import { Button } from "@/components/ui/button";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
    id: string;
};

export const Actions = ({ id }: Props) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Do you want to delete this!?",
        "This account is about to be deleted!"
    )
    const deleteMutation = useDeleteAccount(id);
    const { onOpen } = useOpenAccount();

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
