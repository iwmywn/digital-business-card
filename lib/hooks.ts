import useSWR from "swr";
import { updatePlanIfExpired } from "@/actions/user";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  const { data, error, isLoading } = useSWR<{
    name: string;
    email: string;
    avatar: string;
    currentPlan: string;
  }>("/api/me", fetcher, {
    keepPreviousData: true,
  });

  return {
    user: data,
    isLoading,
    error,
  };
}

export function usePlanStatus() {
  const { data, isLoading } = useSWR<{
    currentPlan?: string;
    error?: string;
    basic?: {
      hasAccess: boolean;
      expiresAt: Date | null;
    };
    professional?: {
      hasAccess: boolean;
      expiresAt: Date | null;
    };
  }>("plan-status", updatePlanIfExpired, { keepPreviousData: true });

  const currentPlan = data?.currentPlan;
  const basic = data?.basic || { hasAccess: false, expiresAt: null };
  const professional = data?.professional || {
    hasAccess: false,
    expiresAt: null,
  };
  const isError = data?.error || null;

  return {
    currentPlan,
    basic,
    professional,
    isLoading,
    isError,
  };
}
