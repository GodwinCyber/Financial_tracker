// import shadcn, a customable open source tool that
// is used for collection  re-usable component that can
// copy and past


import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
};

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
};

export function formatCurrency(value: number) {
  // const finalValue = convertAmountFromMiliunits(value);
  // you can pass it to the final .format(finalValue)
  // check use-get-transactions

  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};
