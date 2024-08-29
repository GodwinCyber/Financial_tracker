/**
 * DataCharts Component:
 * - This component is responsible for fetching summary data and displaying it in various chart formats.
 * - It utilizes the `useGetSummary` hook to retrieve data and manage loading states.
 * - If data is still loading, a loading message is displayed.
 * - Once data is available, it renders a grid layout with two main components:
 *   - `Chart`: Displays a chart of data over days, spanning the larger portion of the grid.
 *   - `SpendingPie`: Visualizes spending categories in a pie chart, occupying the remaining grid space.
 * - The layout is responsive, adjusting column spans for different screen sizes.
 **/

"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { Chart } from "@/components/chart";
import { SpendingPie } from "@/components/spending-pie";

export const DataCharts = () => {
    const { data, isLoading } = useGetSummary();

    if (isLoading) {
        return (
            <div>
                loading....
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <Chart data={data?.days}/>
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                <SpendingPie data={data?.categories}/>
            </div>
        </div>
    );
};
