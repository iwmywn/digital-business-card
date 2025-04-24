import { ObjectId } from "mongodb";

type BaseAvatar<T> = {
  _id: T;
  image: string;
};

type BaseUser<T> = {
  _id: T;
  name: string;
  email: string;
  phone: string;
  password: string;
  emailVerified: boolean;
  image: string;
  verificationToken: string;
  resendVerification: number;
  createdAt: Date;
  updatedAt?: Date;
};

export type Avatar = BaseAvatar<string>;
export type DBAvatar = BaseAvatar<ObjectId>;

export type User = BaseUser<string>;
export type DBUser = BaseUser<ObjectId>;
