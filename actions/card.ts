"use server";

import { ObjectId } from "mongodb";
import { getCardCollection } from "@/lib/collections";
import { session } from "@/lib/session";
import { getUserById } from "@/lib/data";
import { randomBytes } from "crypto";
import type { CardDesignValues } from "@/components/card-design";
import type { PersonalInfoValues } from "@/components/personal-info";
import type { SerializableLinkType } from "@/components/icons";
import { Card } from "@/lib/definitions";
import * as constants from "@/constants";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { extractCloudinaryPath } from "@/lib/utils";

function generateSlug(): string {
  const timePart = Date.now().toString(36);
  const randomPart = randomBytes(10)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${timePart}${randomPart}`;
}

type ImageKey = "logoImage" | "profileImage" | "coverImage";
export async function saveCard(
  cardData: {
    cardDesign: CardDesignValues;
    personalInfo: PersonalInfoValues;
    links: SerializableLinkType[];
  },
  cardId?: string,
) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const updatedCardDesign = { ...cardData.cardDesign };

    if (updatedCardDesign.imageTransforms?.logo) {
      updatedCardDesign.imageTransforms.logo.croppedImageUrl = undefined;
    }
    if (updatedCardDesign.imageTransforms?.cover) {
      updatedCardDesign.imageTransforms.cover.croppedImageUrl = undefined;
    }
    if (updatedCardDesign.imageTransforms?.profile) {
      updatedCardDesign.imageTransforms.profile.croppedImageUrl = undefined;
    }

    const imageKeys: ImageKey[] = ["logoImage", "profileImage", "coverImage"];

    for (const key of imageKeys) {
      const image = cardData.cardDesign[key];
      console.log("save card image: ", image, image?.startsWith("https://"));
      const folder = `business-cards/${key.replace("Image", "")}`;

      if (!image) continue;

      if (image.startsWith("data:")) {
        const { path, error } = await uploadToCloudinary(image, folder);
        if (error || !path) {
          return { error };
        } else {
          updatedCardDesign[key] = path;
        }
      } else if (image.startsWith("https://")) {
        const { path, error } = extractCloudinaryPath(image);
        if (error || !path) {
          return { error: error };
        } else {
          updatedCardDesign[key] = path;
        }
      }
    }

    const cardCollection = await getCardCollection();

    if (cardId) {
      const existingCard = await cardCollection.findOne({
        _id: new ObjectId(cardId),
        userId,
      });

      if (!existingCard) {
        return {
          error: "Card not found or you don't have permission to edit it.",
        };
      }

      const result = await cardCollection.updateOne(
        { _id: new ObjectId(cardId) },
        {
          $set: {
            cardDesign: updatedCardDesign,
            personalInfo: cardData.personalInfo,
            links: cardData.links,
            updatedAt: new Date(),
          },
        },
      );

      if (result.modifiedCount === 0)
        return { error: "Card update failed! Try again later." };
    } else {
      const now = new Date();
      const slug = generateSlug();

      const result = await cardCollection.insertOne({
        userId,
        slug,
        cardDesign: updatedCardDesign,
        personalInfo: cardData.personalInfo,
        links: cardData.links,
        isPublic: true,
        views: 0,
        clicks: 0,
        viewHistory: [],
        clickHistory: [],
        createdAt: now,
        updatedAt: now,
      });

      if (!result.acknowledged)
        return { error: "Card creation failed! Try again later." };
    }

    return {
      success: "Card saved.",
      error: undefined,
    };
  } catch (error) {
    console.error("Error saving card:", error);
    return { error: "Failed to save card! Please try again later." };
  }
}

export async function getCardById(cardId: string) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }
    const cardCollection = await getCardCollection();
    const card = await cardCollection.findOne({
      _id: new ObjectId(cardId),
      userId,
    });

    if (!card) {
      return { error: "Card not found!" };
    }

    return {
      card: {
        ...card,
        _id: card._id.toString(),
      } as Card,
    };
  } catch (error) {
    console.error("Error getting card by id:", error);
    return { error: "Failed to get card by id! Please try again later." };
  }
}

export async function getCardBySlug(slug: string) {
  try {
    const cardCollection = await getCardCollection();
    const card = await cardCollection.findOne({ slug });

    if (!card) {
      return { error: "Card not found!" };
    }

    await cardCollection.updateOne(
      { _id: card._id },
      {
        $inc: { views: 1 },
        $push: {
          viewHistory: {
            date: new Date(),
            count: 1,
          },
        },
      },
    );

    return {
      card: {
        ...card,
        _id: card._id.toString(),
      } as Card,
    };
  } catch (error) {
    console.error("Error getting card slug:", error);
    return { error: "Failed to get card slug! Please try again later." };
  }
}

export async function deleteCard(cardId: string) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }
    const cardCollection = await getCardCollection();

    const existingCard = await cardCollection.findOne({
      _id: new ObjectId(cardId),
      userId,
    });

    if (!existingCard) {
      return {
        error: "Card not found or you don't have permission to delete it.",
      };
    }

    await cardCollection.deleteOne({ _id: new ObjectId(cardId) });

    return { error: undefined };
  } catch (error) {
    console.error("Error deleting card:", error);
    return { error: "Failed to delete card! Please try again later." };
  }
}

export async function trackCardClick(cardId: string) {
  try {
    const cardCollection = await getCardCollection();

    await cardCollection.updateOne(
      { _id: new ObjectId(cardId) },
      {
        $inc: { clicks: 1 },
        $push: {
          clickHistory: {
            date: new Date(),
            count: 1,
          },
        },
      },
    );

    return { error: undefined };
  } catch (error) {
    console.error("Error tracking click:", error);
    return { error: "Failed to track click! Please try again later." };
  }
}

export async function getCards() {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) return { error: "User not found!" };

    const currentPlan = existingUser.currentPlan;
    const cardCollection = await getCardCollection();
    const [cardCount, cards] = await Promise.all([
      cardCollection.countDocuments({ userId }),
      cardCollection.find({ userId }).sort({ createdAt: 1 }).toArray(),
    ]);

    let maxCards = constants.maxFreeCards;

    if (currentPlan === "basic") {
      maxCards = constants.maxBasicCards;
    } else if (currentPlan === "professional") {
      maxCards = constants.maxProfessionalCards;
    }

    const enhancedCards = cards.map((card, index) => {
      const editable = index < maxCards;
      const message = editable
        ? undefined
        : `Your ${currentPlan} plan only allows editing the first ${maxCards} cards.`;

      return {
        ...card,
        _id: card._id.toString(),
        editable,
        message,
      };
    }) as (Card & { editable: boolean; message?: string })[];

    if (cardCount >= maxCards) {
      return {
        error: `You've reached the maximum number of cards (${maxCards}) allowed on your ${currentPlan} plan.`,
        cards: enhancedCards,
      };
    }

    return {
      error: undefined,
      cards: enhancedCards,
    };
  } catch (error) {
    console.error("Error checking card creation limits:", error);
    return {
      error: "Failed to check card creation limits! Please try again later.",
    };
  }
}
