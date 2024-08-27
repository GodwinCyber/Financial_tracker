/**
 * Import necessary modules and components:
 * - InferResponseType: Utility type from Hono to infer the response type.
 * - client: Hono client instance for making API requests.
 * - ColumnDef: Type definition for column configuration from @tanstack/react-table.
 * - ArrowUpDown: Icon component from lucide-react for sorting indicators.
 * - Button, Checkbox: Custom UI components for buttons and checkboxes.
 * - Actions: Component for rendering action buttons in the table.
 * 
 * ResponseType Definition:
 * - Defines the shape of the data returned by the categories API endpoint.
 * 
 * Column Definitions:
 * - Configures the columns for a data table, including selection checkboxes, sortable name column, and action buttons.
 **/

"use client";

import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Actions } from "./actions";


export type ResponseType = InferResponseType<typeof client.api.categories.$get, 200>["data"][0];

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
