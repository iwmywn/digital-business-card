import type { ObjectId } from "mongodb";
import type { SerializableLinkType } from "@/components/icons";
import { PersonalInfoValues } from "@/components/personal-info";
import { CardDesignValues } from "@/components/card-design";

type BasePrivateToken<T> = {
  _id: T;
  token: string;
};

type BaseAvatar<T> = {
  _id: T;
  image: string;
};

type BaseUser<T> = {
  _id: T;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  emailVerified: boolean;
  avatar: string;
  verificationToken: string;
  resendVerification: number;
  stripeCustomerId?: string;
  currentPlan: "free" | "basic" | "professional";
  planExpiresAt?: Date;
  purchasedPlans?: {
    planId: "basic" | "professional";
    purchasedAt: Date;
    expiresAt: Date;
  }[];
  paymentHistory?: PaymentHistory[];
  createdAt: Date;
  updatedAt: Date;
};

type BaseCard<T> = {
  _id: T;
  userId: string;
  slug: string;
  cardDesign: CardDesignValues;
  personalInfo: PersonalInfoValues;
  links: SerializableLinkType[];
  isPublic: boolean;
  views: number;
  clicks: number;
  viewHistory: {
    date: Date;
    count: number;
  }[];
  clickHistory: {
    date: Date;
    count: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

type PaymentHistory = {
  paymentIntentId: string;
  amount: number;
  planId: "basic" | "professional";
  status: string;
  createdAt: Date;
};

export type PrivateToken = BasePrivateToken<string>;
export type DBPrivateToken = BasePrivateToken<ObjectId>;

export type Avatar = BaseAvatar<string>;
export type DBAvatar = BaseAvatar<ObjectId>;

export type User = BaseUser<string>;
export type DBUser = BaseUser<ObjectId>;

export type Card = BaseCard<string>;
export type DBCard = BaseCard<ObjectId>;

export type { PaymentHistory };
