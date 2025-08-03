import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function checkIfEmailExists(email: string): Promise<boolean> {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_users?select=email&email=eq.${encodeURIComponent(email)}`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to check email:", await response.text());
    return false;
  }

  const data = await response.json();
  return data.length > 0;
}
