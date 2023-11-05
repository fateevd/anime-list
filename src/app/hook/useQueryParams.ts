'use client';
import {useSearchParams} from "next/navigation";

export default function useQueryParams() {
  const searchParams = useSearchParams();
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  })

  return params;
}