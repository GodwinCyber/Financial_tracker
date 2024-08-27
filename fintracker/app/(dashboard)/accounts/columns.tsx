/** 
 * Import necessary modules and components:
 * - InferResponseType: Utility type from the Hono framework to infer response types.
 * - client: Hono client instance for API requests.
 * - ColumnDef: Type from @tanstack/react-table for defining table columns.
 * - ArrowUpDown: Icon component from lucide-react for sorting indicators.
 * - Button: Custom button component from the UI library.
 * - Checkbox: Custom checkbox component from the UI library.
 * - Actions: Custom component to handle actions like edit and delete for each row.
 * 
 * ResponseType:
 * - Defines the shape of the data returned from the accounts API.
 * 
 * Columns Definition:
 * - Defines the structure and behavior of columns in a table.
 * - Includes a select column with checkboxes, a sortable name column, and an actions column for row-specific operations.
 **/

"use client";

import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Actions } from "./actions";


export type ResponseType = InferResponseType<typeof client.api.accounts.$get, 200>["data"][0];

// This type is used to define the shape of our data.
// You can use a Zod schema hee if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />
  }
];
