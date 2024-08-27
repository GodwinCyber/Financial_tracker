/**
 * Import necessary modules and components:
 * - Card, CardHeader, CardTitle, CardContent: UI components for card layout.
 * - Button: UI component for buttons.
 * - useState: React hook for state management.
 * - ImportTable: Custom component for displaying and managing table data.
 * - format, parse: Functions from date-fns for date formatting and parsing.
 * - convertAmountToMiliunits: Utility function for converting amount to miliunits.
 */

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableHeadSelect } from "./table-head-select";

type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

export const ImportTable = ({
    headers,
    body,
    selectedColumns,
    onTableHeadSelectChange
}: Props) => {
    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        {headers.map((_item, index) => (
                            <TableHead key={index}>
                                <TableHeadSelect 
                                  columnIndex={index}
                                  selectedColumns={selectedColumns}
                                  onChange={onTableHeadSelectChange}
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row: string[], index) => (
                        <TableRow key={index}>
                            {row.map((cell, index) => (
                                <TableCell key={index}>
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

