import { Mail, Phone, Globe, Link2, MapPin, Ghost } from "lucide-react";

import {
  type SimpleIcon,
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
  siPinterest,
  siReddit,
  siTumblr,
  siQuora,
  siWechat,
  siLine,
  siNotion,
  siMedium,
  siSlack,
  siDribbble,
  siFigma,
  siPatreon,
  siBuymeacoffee,
  siKofi,
  siGooglepay,
  siApplepay,
  siSamsungpay,
  siStripe,
  siXiaohongshu,
  siViber,
} from "simple-icons";
import type { ElementType } from "react";

interface SimpleIconProps {
  className?: string;
  icon: SimpleIcon;
}

export type LinkType = {
  id: string;
  type: string;
  value: string;
  category: string;
  icon: ElementType;
  label?: string;
};

export type SerializableLinkType = {
  id: string;
  type: string;
  value: string;
  category: string;
  label?: string;
};

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

export function toSerializableLink(link: LinkType): SerializableLinkType {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { icon, ...rest } = link;
  /* eslint-enable @typescript-eslint/no-unused-vars */
  return rest;
}

export function toLinkType(link: SerializableLinkType): LinkType {
  const linkType = linkTypes.find((lt) => lt.type === link.type);
  return {
    ...link,
    icon: linkType?.icon || Ghost,
    category: link.category || "General",
  };
}

export const LinkedInIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

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
    icon: () => <SimpleIconComponent icon={siX} />,
    category: "Social",
  },
  {
    type: "Instagram",
    icon: () => <SimpleIconComponent icon={siInstagram} />,
    category: "Social",
  },
  {
    type: "Threads",
    icon: () => <SimpleIconComponent icon={siThreads} />,
    category: "Social",
  },
  {
    type: "Bluesky",
    icon: () => <SimpleIconComponent icon={siBluesky} />,
    category: "Social",
  },
  {
    type: "Facebook",
    icon: () => <SimpleIconComponent icon={siFacebook} />,
    category: "Social",
  },
  {
    type: "YouTube",
    icon: () => <SimpleIconComponent icon={siYoutube} />,
    category: "Social",
  },
  {
    type: "Snapchat",
    icon: () => <SimpleIconComponent icon={siSnapchat} />,
    category: "Social",
  },
  {
    type: "TikTok",
    icon: () => <SimpleIconComponent icon={siTiktok} />,
    category: "Social",
  },
  {
    type: "Twitch",
    icon: () => <SimpleIconComponent icon={siTwitch} />,
    category: "Social",
  },
  {
    type: "Yelp",
    icon: () => <SimpleIconComponent icon={siYelp} />,
    category: "Social",
  },
  {
    type: "Pinterest",
    icon: () => <SimpleIconComponent icon={siPinterest} />,
    category: "Social",
  },
  {
    type: "Reddit",
    icon: () => <SimpleIconComponent icon={siReddit} />,
    category: "Social",
  },
  {
    type: "Tumblr",
    icon: () => <SimpleIconComponent icon={siTumblr} />,
    category: "Social",
  },
  {
    type: "Quora",
    icon: () => <SimpleIconComponent icon={siQuora} />,
    category: "Social",
  },
  {
    type: "RedNote",
    icon: () => <SimpleIconComponent icon={siXiaohongshu} />,
    category: "Social",
  },

  // Messaging
  {
    type: "WhatsApp",
    icon: () => <SimpleIconComponent icon={siWhatsapp} />,
    category: "Messaging",
  },
  {
    type: "Signal",
    icon: () => <SimpleIconComponent icon={siSignal} />,
    category: "Messaging",
  },
  {
    type: "Discord",
    icon: () => <SimpleIconComponent icon={siDiscord} />,
    category: "Messaging",
  },
  {
    type: "Telegram",
    icon: () => <SimpleIconComponent icon={siTelegram} />,
    category: "Messaging",
  },
  {
    type: "WeChat",
    icon: () => <SimpleIconComponent icon={siWechat} />,
    category: "Messaging",
  },
  {
    type: "Line",
    icon: () => <SimpleIconComponent icon={siLine} />,
    category: "Messaging",
  },
  {
    type: "Viber",
    icon: () => <SimpleIconComponent icon={siViber} />,
    category: "Messaging",
  },

  // Business
  {
    type: "GitHub",
    icon: () => <SimpleIconComponent icon={siGithub} />,
    category: "Business",
  },
  {
    type: "Calendly",
    icon: () => <SimpleIconComponent icon={siCalendly} />,
    category: "Business",
  },
  {
    type: "Medium",
    icon: () => <SimpleIconComponent icon={siMedium} />,
    category: "Business",
  },
  {
    type: "Notion",
    icon: () => <SimpleIconComponent icon={siNotion} />,
    category: "Business",
  },
  {
    type: "Slack",
    icon: () => <SimpleIconComponent icon={siSlack} />,
    category: "Business",
  },
  {
    type: "Dribbble",
    icon: () => <SimpleIconComponent icon={siDribbble} />,
    category: "Business",
  },
  {
    type: "Figma",
    icon: () => <SimpleIconComponent icon={siFigma} />,
    category: "Business",
  },
  {
    type: "LinkedIn",
    icon: () => LinkedInIcon,
    category: "Business",
  },

  // Payment
  {
    type: "PayPal",
    icon: () => <SimpleIconComponent icon={siPaypal} />,
    category: "Payment",
  },
  {
    type: "Venmo",
    icon: () => <SimpleIconComponent icon={siVenmo} />,
    category: "Payment",
  },
  {
    type: "CashApp",
    icon: () => <SimpleIconComponent icon={siCashapp} />,
    category: "Payment",
  },
  {
    type: "Patreon",
    icon: () => <SimpleIconComponent icon={siPatreon} />,
    category: "Payment",
  },
  {
    type: "BuyMeACoffee",
    icon: () => <SimpleIconComponent icon={siBuymeacoffee} />,
    category: "Payment",
  },
  {
    type: "Ko-fi",
    icon: () => <SimpleIconComponent icon={siKofi} />,
    category: "Payment",
  },
  {
    type: "Google Pay",
    icon: () => <SimpleIconComponent icon={siGooglepay} />,
    category: "Payment",
  },
  {
    type: "Apple Pay",
    icon: () => <SimpleIconComponent icon={siApplepay} />,
    category: "Payment",
  },
  {
    type: "Samsung Pay",
    icon: () => <SimpleIconComponent icon={siSamsungpay} />,
    category: "Payment",
  },
  {
    type: "Stripe",
    icon: () => <SimpleIconComponent icon={siStripe} />,
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
