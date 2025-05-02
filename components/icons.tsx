import type React from "react";
import { Mail, Phone, Globe, Link2, MapPin } from "lucide-react";

import {
  siX,
  siInstagram,
  siFacebook,
  siYoutube,
  siSnapchat,
  siTiktok,
  siTwitch,
  siYelp,
  siWhatsapp,
  siDiscord,
  siBluesky,
  siTelegram,
  siGithub,
  siPaypal,
  siThreads,
  siSignal,
  siCashapp,
  siVenmo,
  siCalendly,
  type SimpleIcon,
} from "simple-icons";

export interface SimpleIconProps {
  className?: string;
  icon: SimpleIcon;
}

export interface IconComponentProps {
  className?: string;
}

export const SimpleIconComponent = ({ icon, className }: SimpleIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
};

export type LinkType = {
  id: string;
  type: string;
  value: string;
  category: string;
  icon: React.ElementType;
  label?: string;
};

export const linkTypes = [
  // General
  { type: "Email", icon: Mail, category: "General" },
  { type: "Phone", icon: Phone, category: "General" },
  { type: "Company URL", icon: Globe, category: "General" },
  { type: "Link", icon: Link2, category: "General" },
  { type: "Address", icon: MapPin, category: "General" },

  // Social
  {
    type: "X",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siX} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Instagram",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siInstagram} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Threads",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siThreads} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Bluesky",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siBluesky} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Facebook",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siFacebook} {...props} />
    ),
    category: "Social",
  },
  {
    type: "YouTube",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siYoutube} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Snapchat",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siSnapchat} {...props} />
    ),
    category: "Social",
  },
  {
    type: "TikTok",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siTiktok} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Twitch",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siTwitch} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Yelp",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siYelp} {...props} />
    ),
    category: "Social",
  },

  // Messaging
  {
    type: "WhatsApp",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siWhatsapp} {...props} />
    ),
    category: "Messaging",
  },
  {
    type: "Signal",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siSignal} {...props} />
    ),
    category: "Messaging",
  },
  {
    type: "Discord",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siDiscord} {...props} />
    ),
    category: "Messaging",
  },
  {
    type: "Telegram",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siTelegram} {...props} />
    ),
    category: "Messaging",
  },

  // Business
  {
    type: "GitHub",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siGithub} {...props} />
    ),
    category: "Business",
  },
  {
    type: "Calendly",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siCalendly} {...props} />
    ),
    category: "Business",
  },

  // Payment
  {
    type: "PayPal",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siPaypal} {...props} />
    ),
    category: "Payment",
  },
  {
    type: "Venmo",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siVenmo} {...props} />
    ),
    category: "Payment",
  },
  {
    type: "CashApp",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siCashapp} {...props} />
    ),
    category: "Payment",
  },
];

export const categories = [
  "General",
  "Social",
  "Messaging",
  "Business",
  "Payment",
];
