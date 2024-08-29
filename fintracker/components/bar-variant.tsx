/**
 * BarVariant Component:
 * - Displays a bar chart showing income and expenses over time using `recharts`.
 * - Includes `CartesianGrid` for grid lines and `XAxis` for date-based ticks formatted with `date-fns`.
 * - Features `Tooltip` with a custom component (`CustomTooltip`) for detailed data display.
 * - Bars are color-coded for income (`#3b82f6`) and expenses (`#f43f5e`), with drop shadows for visual enhancement.
 * - The chart is responsive, adjusting to container width with a fixed height of 350 pixels.
 **/

import { CustomTooltip } from "@/components/custom-tooltip";
import { format } from "date-fns";
import {
    Tooltip,
    XAxis,
    AreaChart,
    Area,
    ResponsiveContainer,
    CartesianGrid,
    BarChart,
    Bar,
} from "recharts";

type Props = {
    data: {
        date: string;
        income: number;
        expenses: number;
    }[];
};

export const BarVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3.3" />
                <XAxis 
                axisLine={false}
                tickLine={false}
                dataKey="date"
                tickFormatter={(value) => format(value, "dd MMM")}
                style={{ fontSize: "12px" }}
                tickMargin={16}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                    dataKey="income"
                    fill="#3b82f6"
                    className="drop-shadow-sm"
                    />
                    <Bar 
                    dataKey="expenses"
                    fill="#f43f5e"
                    className="drop-shadow-sm"
                    />
            </BarChart>
        </ResponsiveContainer>
    );
};
