import useSWR from "swr";
import { updatePlanIfExpired } from "@/actions/user";
import type { PaymentHistory } from "@/lib/definitions";
import { me } from "@/actions/auth";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  const { data, isLoading } = useSWR<{
    name?: string;
    email?: string;
    avatar?: string;
    currentPlan?: string;
    error?: string;
  }>("me", me, {
    keepPreviousData: true,
  });

  const name = data?.name;
  const email = data?.email;
  const avatar = data?.avatar;
  const currentPlan = data?.currentPlan;
  const isError = data?.error || null;

  return {
    name,
    email,
    avatar,
    currentPlan,
    isLoading,
    isError,
  };
}

export function useSubscription() {
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
    paymentHistory?: PaymentHistory[];
  }>("plan-status", updatePlanIfExpired, { keepPreviousData: true });

  const currentPlan = data?.currentPlan;
  const basic = data?.basic || { hasAccess: false, expiresAt: null };
  const professional = data?.professional || {
    hasAccess: false,
    expiresAt: null,
  };
  const paymentHistory = data?.paymentHistory || [];
  const isError = data?.error || null;

  return {
    currentPlan,
    basic,
    professional,
    isLoading,
    isError,
    paymentHistory,
  };
}
