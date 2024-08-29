/**
 * SpendingPie Component:
 * - Displays a `Card` component with a header and content area.
 * - Allows users to select the type of chart to display (Pie, Radar, or Radial) using a `Select` component.
 * - Updates the displayed chart type based on user selection.
 * - Shows a placeholder message with an icon if no data is available.
 * - Renders the appropriate chart variant (`PieVariant`, `RadarVariant`, or `RadialVariant`) based on the selected chart type.
 * - Defaults to displaying a pie chart if no other chart type is selected.
 */

import  {
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem
  } from "@/components/ui/select";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {  FileSearch, PieChart, Radar, Target } from "lucide-react";
import { useState } from "react";
import { PieVariant } from "@/components/pie-variant";
import { RadarVariant } from "./radar.variant";
import { RadialVariant } from "./radial-varaint";

type Props = {
    data?: {
        name: string;
        value: number;
    }[];
};

export const SpendingPie = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState("pie");
    
    const onTypeChange = (type: string) => {
        setChartType(type);
    };

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    Categories
                </CardTitle>
                <Select
                  defaultValue={chartType}
                  onValueChange={onTypeChange}
                >
                    <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                        <SelectValue placeholder="Chart type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pie">
                            <div className="flex items-center">
                                <PieChart className="size-4 mr-2 shrink-0"/>
                                <p className="line-clamp-1">
                                    Pie chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radar">
                            <div className="flex items-center">
                                <Radar className="size-4 mr-2 shrink-0"/>
                                <p className="line-clamp-1">
                                    Radar chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radial">
                            <div className="flex items-center">
                                <Target className="size-4 mr-2 shrink-0"/>
                                <p className="line-clamp-1">
                                    Radial chart
                                </p>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="p-0">
                {data.length === 0 ? (
                    <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                        <FileSearch className="size-6 text-muted-foreground"/>
                        <p className="text-muted-foreground text-sm">
                            No data for this period
                        </p>
                    </div>
                ): (
                    <>
                        {chartType === "pie" && <PieVariant data={data}/>}
                        {chartType === "radar" && <RadarVariant data={data}/>}
                        {chartType === "radial" && <RadialVariant data={data}/>}
                    </>
                )}
            </CardContent>
        </Card>
    );
};


