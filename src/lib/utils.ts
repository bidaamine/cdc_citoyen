import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function submissionWindowOpen(date = new Date()) {
  const month = date.getMonth();
  return month >= 0 && month <= 2;
}

export function nextExerciseYear(date = new Date()) {
  return date.getFullYear() + 1;
}
