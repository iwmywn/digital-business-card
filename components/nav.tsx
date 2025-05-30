"use client";

import {
  CircleHelpIcon,
  Contact,
  ReceiptText,
  GlobeLock,
  type LucideIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContactDialog } from "@/components/contact-dialog";
import { FAQDialog } from "@/components/faq-dialog";
import { useState } from "react";
import { TermsOfServiceDialog } from "@/components/terms-of-service-dialog";
import { PrivacyPolicyDialog } from "@/components/privacy-policy-dialog";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavProps {
  nav: NavItem[];
}

export function Nav({ nav }: NavProps) {
  const pathname = usePathname();
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {nav.map((item) => {
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="FAQ"
                onClick={() => setIsFaqOpen(true)}
              >
                <CircleHelpIcon />
                <span>FAQ</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Terms of Service"
                onClick={() => setIsTermsOpen(true)}
              >
                <ReceiptText />
                <span>Terms of Service</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Privacy Policy"
                onClick={() => setIsPrivacyOpen(true)}
              >
                <GlobeLock />
                <span>Privacy Policy</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Contact Us"
                onClick={() => setIsContactOpen(true)}
              >
                <Contact />
                <span>Contact Us</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <FAQDialog open={isFaqOpen} setOpen={setIsFaqOpen} />
      <TermsOfServiceDialog open={isTermsOpen} setOpen={setIsTermsOpen} />
      <PrivacyPolicyDialog open={isPrivacyOpen} setOpen={setIsPrivacyOpen} />
      <ContactDialog open={isContactOpen} setOpen={setIsContactOpen} />
    </>
  );
}
