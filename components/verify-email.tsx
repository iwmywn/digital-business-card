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
  const [message, setMessage] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      const { error } = await verifyEmail(email, token);

      if (error) {
        setMessage(error);
      } else {
        setIcon(() => Check);
        setMessage("Email verified successfully.");
      }
      setLoading(false);
    };

    fetchToken();
  }, [token, email]);

  if (loading) {
    return <Loading />;
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
