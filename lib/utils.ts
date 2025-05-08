import { allColorOptions, allFontOptions } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColorClass(value: string): string | undefined {
  return allColorOptions.find((option) => option.value === value)?.color;
}

export function getFontClass(value: string): string | undefined {
  return allFontOptions.find((option) => option.value === value)?.className;
}
