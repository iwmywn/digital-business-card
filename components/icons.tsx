import { Mail, Phone, Globe, Link2, MapPin, Ghost } from "lucide-react";

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
  siPinterest,
  siReddit,
  siTumblr,
  siQuora,
  siWechat,
  siLine,
  siMessenger,
  siNotion,
  siMedium,
  siSlack,
  siDribbble,
  siFigma,
  siPatreon,
  siBuymeacoffee,
  siKofi,
} from "simple-icons";
import type { ElementType } from "react";

interface SimpleIconProps {
  className?: string;
  icon: SimpleIcon;
}

interface IconComponentProps {
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
  {
    type: "Pinterest",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siPinterest} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Reddit",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siReddit} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Tumblr",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siTumblr} {...props} />
    ),
    category: "Social",
  },
  {
    type: "Quora",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siQuora} {...props} />
    ),
    category: "Social",
  },
  {
    type: "LinkedIn",
    icon: (props: IconComponentProps) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-linkedin-icon lucide-linkedin"
        {...props}
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
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
  {
    type: "WeChat",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siWechat} {...props} />
    ),
    category: "Messaging",
  },
  {
    type: "Line",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siLine} {...props} />
    ),
    category: "Messaging",
  },
  {
    type: "Messenger",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siMessenger} {...props} />
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
  {
    type: "Medium",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siMedium} {...props} />
    ),
    category: "Business",
  },
  {
    type: "Notion",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siNotion} {...props} />
    ),
    category: "Business",
  },
  {
    type: "Slack",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siSlack} {...props} />
    ),
    category: "Business",
  },
  {
    type: "Dribbble",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siDribbble} {...props} />
    ),
    category: "Business",
  },
  {
    type: "Figma",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siFigma} {...props} />
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
  {
    type: "Patreon",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siPatreon} {...props} />
    ),
    category: "Payment",
  },
  {
    type: "BuyMeACoffee",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siBuymeacoffee} {...props} />
    ),
    category: "Payment",
  },
  {
    type: "Ko-fi",
    icon: (props: IconComponentProps) => (
      <SimpleIconComponent icon={siKofi} {...props} />
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
