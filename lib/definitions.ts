import type { ObjectId } from "mongodb";
import type { SerializableLinkType } from "@/components/icons";
import type { PersonalInfoValues } from "@/components/personal-info";
import type { CardDesignValues, Image } from "@/components/card-design";
import type { ImageTransform } from "@/components/image-editor-dialog";

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
  username?: string;
  email: string;
  phone: string;
  password: string;
  emailVerified: boolean;
  verificationToken: string;
  resendVerification: number;
  stripeCustomerId?: string;
  profile: Profile;
  notificationSettings: NotificationSettings;
  currentPlan: "free" | "basic" | "professional";
  planExpiresAt?: Date;
  purchasedPlans?: PurchasedPlans[];
  paymentHistory?: PaymentHistory[];
  createdAt: Date;
  updatedAt: Date;
};

type BaseCard<T> = {
  _id: T;
  userId: string;
  slug?: string;
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
  viewFingerprint: {
    [date: string]: string[];
  };
  clickFingerprint: {
    [date: string]: {
      [visitorId: string]: string[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
};

type BaseIssue<T> = {
  _id: T;
  userId: string;
  title: string;
  type: "bug" | "feature" | "improvement";
  description: string;
  steps?: string;
  submittedAt: Date;
};

type BaseContact<T> = {
  _id: T;
  userId: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone?: string;
  department: string;
  message: string;
  submittedAt: Date;
};

type Profile = {
  profileImage?: Image;
  coverImage?: Image;
  fullName: string;
  gender?: string;
  dateOfBirth?: string;
  jobTitle?: string;
  company?: string;
  website?: string;
  bio?: string;
  imageTransforms?: {
    profile?: ImageTransform;
    cover?: ImageTransform;
  };
};

type NotificationSettings = {
  email: boolean;
  cardView: boolean;
  marketing: boolean;
  security: boolean;
};

type PurchasedPlans = {
  planId: "basic" | "professional";
  purchasedAt: Date;
  expiresAt: Date;
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

export type Issue = BaseIssue<string>;
export type DBIssue = BaseIssue<ObjectId>;

export type Contact = BaseContact<string>;
export type DBContact = BaseContact<ObjectId>;

export type { PaymentHistory, Profile, NotificationSettings };
