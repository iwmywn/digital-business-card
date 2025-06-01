"use client";

import { useState, useEffect } from "react";
import { Check, X, type LucideIcon } from "lucide-react";
import { Loading } from "@/components/loading";
import { verifyEmail } from "@/actions/auth";

export function VerifyEmail({
  token,
  email,
}: {
  token: string | undefined;
  email: string | undefined;
}) {
  const [Icon, setIcon] = useState<LucideIcon>(() => X);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { success, error } = await verifyEmail(email, token);

      if (error || !success) {
        setMessage(error);
      } else {
        setIcon(() => Check);
        setMessage(success);
      }
      setIsLoading(false);
    })();
  }, [token, email]);

  if (isLoading) {
    return <Loading className="h-8 w-8 border-white border-t-black/10" />;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 text-sm">
        <Icon size={30} />
        {message}
      </div>
    </>
  );
}
