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
      try {
        const res = await verifyEmail(email, token);

        if (res.success) {
          setIcon(() => Check);
          setMessage(res.success);
        } else {
          setMessage(res.error);
        }
      } catch (error) {
        console.error("Verification token error: ", error);
        setMessage("Something went wrong! Please try again.");
      } finally {
        setLoading(false);
      }
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
