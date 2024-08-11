// Importing a shadcn: it is an open source tool
// that is accessible and can be customazible; it
// is used for collection of re-usable component
// it can be copied and pasted in the design
// importing using shadcn-ui@lates init

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
