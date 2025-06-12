"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TermsOfServiceDialog } from "@/components/terms-of-service-dialog";
import { PrivacyPolicyDialog } from "@/components/privacy-policy-dialog";
import { FAQDialog } from "@/components/faq-dialog";
import { Separator } from "@/components/ui/separator";
import { LandingPageThemeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { LinkedInIcon, SimpleIconComponent } from "@/components/icons";
import { siFacebook, siInstagram, siX } from "simple-icons";

const visiqSocialLinks = [
  {
    href: "https://www.facebook.com",
    label: "Facebook",
    icon: <SimpleIconComponent icon={siFacebook} />,
  },
  {
    href: "https://www.instagram.com",
    label: "Instagram",
    icon: <SimpleIconComponent icon={siInstagram} />,
  },
  {
    href: "https://x.com",
    label: "X",
    icon: <SimpleIconComponent icon={siX} />,
  },
  {
    href: "https://www.linkedin.com",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
];

export function Foorter() {
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  return (
    <>
      <footer className="w-full border-t px-6 text-xs md:px-8 lg:px-10">
        <div className="py-2 md:py-3 lg:py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setIsFaqOpen(true)}
              >
                FAQ
              </div>
              <Separator
                orientation="vertical"
                className="border-muted-foreground h-4"
              />
              <div
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setIsTermsOpen(true)}
              >
                Terms
              </div>
              <Separator
                orientation="vertical"
                className="border-muted-foreground h-4"
              />
              <div
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setIsPrivacyOpen(true)}
              >
                Privacy
              </div>
            </div>
            <div className="text-muted-foreground flex flex-col-reverse items-center gap-1 min-[33.75rem]:flex-row">
              <span>
                &copy; {new Date().getFullYear()} Visiq. All rights reserved.
              </span>
              <Separator
                orientation="vertical"
                className="border-muted-foreground ml-3 hidden h-6 min-[33.75rem]:block"
              />
              <div className="flex items-center gap-1">
                {visiqSocialLinks.map(({ href, label, icon }) => (
                  <Button key={label} variant="ghost" asChild>
                    <Link href={href} target="_blank" rel="noopener noreferrer">
                      {icon}
                      <span className="sr-only">{label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
              <Separator
                orientation="vertical"
                className="border-muted-foreground mr-3 hidden h-6 min-[33.75rem]:block"
              />
              <div className="flex items-center rounded-sm border">
                <LandingPageThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <FAQDialog open={isFaqOpen} setOpen={setIsFaqOpen} />
      <TermsOfServiceDialog open={isTermsOpen} setOpen={setIsTermsOpen} />
      <PrivacyPolicyDialog open={isPrivacyOpen} setOpen={setIsPrivacyOpen} />
    </>
  );
}
