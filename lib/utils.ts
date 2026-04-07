import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatPeriod(startDate: string, endDate: string): string {
  const fmt = (d: string) => {
    const [year, month] = d.split('-')
    return `${MONTHS[parseInt(month, 10) - 1]} ${year}`
  }
  const start = fmt(startDate)
  const end = fmt(endDate)
  return start === end ? start : `${start} – ${end}`
}
