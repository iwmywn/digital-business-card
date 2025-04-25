import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  const { data, error, isLoading } = useSWR<{
    name: string;
    email: string;
    avatar: string;
  }>("/api/me", fetcher, {
    keepPreviousData: true,
  });

  return {
    user: data,
    isLoading,
    error,
  };
}
