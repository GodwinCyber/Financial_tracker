/**
 * Import necessary modules and components:
 * - useOpenCategory: Custom hook for handling the opening of category details.
 * - useOpenTransaction: Custom hook for handling the opening of transaction details.
 * - TriangleAlert: Icon component from lucide-react used to display an alert icon.
 * - cn: Utility function for conditional classNames.
 * 
 * Props Type:
 * - Defines the shape of the props for the CategoryColumn component.
 * - id: The unique identifier for the transaction.
 * - category: The name of the category. Can be null if not assigned.
 * - categoryId: The unique identifier for the category. Can be null if not assigned.
 * 
 * CategoryColumn Component:
 * - Renders a column that displays the category name or a default "Uncategorized" label.
 * - Uses `useOpenCategory` to handle opening category details if `categoryId` is provided.
 * - Uses `useOpenTransaction` to handle opening transaction details if `categoryId` is not provided.
 * - Applies conditional styling to highlight uncategorized items with a red text color and an alert icon.
 **/

import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";


type Props = {
    id: string;
    category: string | null;
    categoryId: string | null;
};

export const CategoryColumn = ({
    id,
    category,
    categoryId,
}: Props) => {
    const { onOpen: onOpenCategory } = useOpenCategory();
    const { onOpen: onOpenTransaction } = useOpenTransaction();

    const onClick = () => {
        if (categoryId) {
            onOpenCategory(categoryId);
        } else {
            onOpenTransaction(id);
        }
    };
    return (
        <div
          onClick={onClick}
          className={cn(
            "flex items-center cursor-pointer hover:underline",
            !category && "text-rose-500",
          )}
        >
            {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
            {category || "Uncategorized"}
        </div>
    );
};

