// import shadcn, a customable open source tool that
// is used for collection  re-usable component that can
// copy and past


import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
