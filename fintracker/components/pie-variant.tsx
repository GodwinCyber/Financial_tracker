/**
 * PieVariant Component:
 * - This component displays a PieChart using the Recharts library, showcasing data in a circular format.
 * - It includes key chart components like Pie, Legend, Tooltip, and Cell.
 * - Each slice of the pie is colored dynamically using a predefined list of colors.
 * - The Legend is customized to show category names and their corresponding percentages, formatted for readability.
 * - The Tooltip component provides additional information when hovering over the chart.
 * - The chart is responsive, ensuring it adapts well to different screen sizes, with a fixed height of 350px.
 **/

import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";

import { formatPercentage } from "@/lib/utils";
import { CategoryTooltip } from "@/components/category-tooltip";

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#F9354"];

type Props = {
    data: {
        name: string;
        value: number;
    }[];
};

export const PieVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%"  height={350}>
            <PieChart>
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="right"
                  iconType="circle"
                  content={({ payload }: any) => {
                    return (
                        <ul className="flex flex-col space-y-2">
                            {payload.map((entry: any, index: number) => (
                                <li
                                  key={`item-${index}`}
                                  className="flex items-center space-x-2"
                                >
                                    <span 
                                      className="size-2 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <div className="space-x-1">
                                        <span className="text-sm text-muted-foreground">
                                            {entry.value}
                                        </span>
                                        <span className="text-sm">
                                            {formatPercentage(entry.payload.percent * 100)}
                                        </span>
                                    </div>
                                </li>
                            ))}

                        </ul>
                    );
                  }}
                />
                <Tooltip content={<CategoryTooltip />}/>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={60}
                  paddingAngle={2}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                >
                    {data.map((_entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}


