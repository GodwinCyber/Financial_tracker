/**
 * AmountInput Component:
 * - Provides an input field for entering monetary amounts, with automatic currency formatting using `CurrencyInput`.
 * - Includes functionality to toggle the value between income (positive) and expense (negative) by clicking a button.
 * - The button's appearance changes based on whether the amount is classified as income or expense, utilizing icons (`PlusCircle`, `MinusCircle`, `Info`) from `lucide-react`.
 * - Tooltips offer user guidance on the input's functionality.
 * - The component handles changes in value and displays a contextual message indicating whether the amount is income or expense.
 **/

import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    value: string;
    onChange: (value: string | undefined) => void;
    disabled?: boolean;
    placeholder?: string;
};

export const AmountInput = ({
    value,
    onChange,
    disabled,
    placeholder,
}: Props) => {
    const parseValue = parseFloat(value);
    const isIncome = parseValue > 0;
    const isExpense = parseValue < 0;

    const onReverseValue = () => {
        if (!value) return;

        const newValue = parseFloat(value) * -1;
        onChange(newValue.toString());
    };
    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={onReverseValue}
                          className={cn(
                            "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                            isIncome && "bg-emerald-500 hover:bg-emerald-500",
                            isExpense && "bg-rose-500 hover:bg-rose-500"
                          )}
                        >
                            {!parseValue && <Info className="size-3 text-white"/>}
                            {!isIncome && <PlusCircle className="size-3 text-white"/>}
                            {!isExpense && <MinusCircle className="size-3 text-white"/>}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] for income and [-] for expenses
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput 
              prefix="$"
              className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={placeholder}
              value={value}
              decimalsLimit={2}
              decimalScale={2}
              onValueChange={onChange}
              disabled={disabled}
            />
            <p className="text-xs text-muted-foreground mt-2">
                {isIncome && "This will count as income"}
                {isExpense && "This will count as expense"}
            </p>
        </div>
    );
};

