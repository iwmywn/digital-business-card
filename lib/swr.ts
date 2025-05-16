import useSWR from "swr";
import { getSubscriptionPlans } from "@/actions/plan";
import type { Card, PaymentHistory, User } from "@/lib/definitions";
import { me } from "@/actions/auth";
import { getCards } from "@/actions/card";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  const { data, isLoading, mutate } = useSWR<
    | {
        error: string;
        user?: undefined;
      }
    | {
        user: User;
        error?: undefined;
      }
  >("me", me, {
    keepPreviousData: true,
  });

  const userResponse = data;
  const user = data?.user;
  const isUserError = data?.error;
  const isUserLoading = isLoading;

  return {
    userResponse,
    user,
    isUserLoading,
    isUserError,
    mutate,
  };
}

export function useSubscription() {
  const { data, isLoading } = useSWR<{
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
  }>("subscription-plans", getSubscriptionPlans, { keepPreviousData: true });

  const basic = data?.basic || { hasAccess: false, expiresAt: null };
  const professional = data?.professional || {
    hasAccess: false,
    expiresAt: null,
  };
  const paymentHistory = data?.paymentHistory || [];
  const isSubscriptionError = data?.error || null;
  const isSubScriptionLoading = isLoading;

  return {
    basic,
    professional,
    isSubScriptionLoading,
    isSubscriptionError,
    paymentHistory,
  };
}

export function useCard() {
  const { data, isLoading, mutate } = useSWR<{
    error?: string;
    cards?: (Card & {
      editable: boolean;
      message?: string;
      dynamicSlug: string;
    })[];
  }>("cards", getCards, { keepPreviousData: true });

  const cardResponse = data;
  const cards = data?.cards || [];
  const isCardError = data?.error;
  const isCardLoading = isLoading;

  return { cardResponse, isCardLoading, isCardError, cards, mutate };
}
