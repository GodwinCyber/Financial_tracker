/**
 * DataGrid Component:
 * - Fetches summary data using `useGetSummary` hook.
 * - Retrieves date range from URL parameters and formats it using `formatDateRange`.
 * - Displays loading skeletons if data is still being fetched.
 * - Displays three `DataCard` components with:
 *   - Remaining amount with `FaPiggyBank` icon.
 *   - Income amount with `FaArrowTrendUp` icon.
 *   - Expenses amount with `FaArrowTrendDown` icon.
 * - Passes formatted date range and data values to `DataCard` components.
 **/

"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { DataCard, DataCardLoading } from "@/components/data-card";

export const DataGrid = () => {
    const { data, isLoading } = useGetSummary();
    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from =  params.get("from") || undefined;

    const dateRangleLabel = formatDateRange({ to, from });

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
        </div>
      );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
           <DataCard
             title="Remaining"
             value={data?.remainingAmount}
             percentageChange={data?.remainingChange}
             icon={FaPiggyBank}
             variant="default"
             dateRange={dateRangleLabel}
           />
           <DataCard
             title="Income"
             value={data?.incomeAmount}
             percentageChange={data?.incomeChange}
             icon={FaArrowTrendUp}
             dateRange={dateRangleLabel}
           />
           <DataCard
             title="Expenses"
             value={data?.expensesAmount}
             percentageChange={data?.expensesChange}
             icon={FaArrowTrendDown}
             dateRange={dateRangleLabel}
           />
        </div>
    );
};

