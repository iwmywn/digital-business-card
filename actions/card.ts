"use server";

import { ObjectId } from "mongodb";
import { getCardCollection, getUserCollection } from "@/lib/collections";
import { session } from "@/lib/session";
import { getUserById } from "@/lib/data";
import type { CardDesignValues } from "@/components/card-design";
import type { PersonalInfoValues } from "@/components/personal-info";
import type { SerializableLinkType } from "@/components/icons";
import type { Card } from "@/lib/definitions";
import * as constants from "@/constants";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { extractCloudinaryPath, someRight } from "@/lib/utils";
import { SlugFormValues } from "@/components/custom-slug-dialog";
import { cardSlugSchema } from "@/schemas";

type ImageKey = "logoImage" | "profileImage" | "coverImage";
export async function saveCard(
  cardDesign: CardDesignValues,
  personalInfo: PersonalInfoValues,
  links: SerializableLinkType[],
  isPublic: boolean,
  cardId?: string,
) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) return { error: "User not found!" };

    const updatedCardDesign = { ...cardDesign };

    if (updatedCardDesign.imageTransforms?.logo) {
      updatedCardDesign.imageTransforms.logo.croppedImageUrl = null;
    }
    if (updatedCardDesign.imageTransforms?.cover) {
      updatedCardDesign.imageTransforms.cover.croppedImageUrl = null;
    }
    if (updatedCardDesign.imageTransforms?.profile) {
      updatedCardDesign.imageTransforms.profile.croppedImageUrl = null;
    }

    const imageKeys: ImageKey[] = ["logoImage", "profileImage", "coverImage"];

    for (const key of imageKeys) {
      const image = cardDesign[key];
      const folder = key.replace("Image", "");

      if (!image) continue;

      if (image[1].startsWith("data:")) {
        const { path, error } = await uploadToCloudinary(image[1], folder);
        if (error || !path) {
          return { error };
        } else {
          updatedCardDesign[key] = [image[0], path];
        }
      } else if (image[1].startsWith("https://")) {
        const { path, error } = extractCloudinaryPath(image[1]);
        if (error || !path) {
          return { error: error };
        } else {
          updatedCardDesign[key] = [image[0], path];
        }
      }
    }

    const cardCollection = await getCardCollection();
    const { currentPlan } = existingUser;
    let maxCards = constants.maxFreeCards;

    if (currentPlan === "basic") {
      maxCards = constants.maxBasicCards;
    } else if (currentPlan === "professional") {
      maxCards = constants.maxProfessionalCards;
    }

    if (cardId) {
      const cards = await cardCollection
        .find({ userId })
        .sort({ createdAt: 1 })
        .toArray();
      const editableCard = cards.find(
        (c, idx) => c._id.toString() === cardId && idx < maxCards,
      );

      if (!editableCard) {
        return {
          error: `Your ${currentPlan} plan only allows editing the first ${maxCards} card(s)!`,
        };
      }

      const existingCard = await cardCollection.findOne({
        _id: new ObjectId(cardId),
        userId,
      });

      if (!existingCard) {
        return {
          error: "Card not found or you don't have permission to edit it!",
        };
      }

      await cardCollection.updateOne(
        { _id: new ObjectId(cardId) },
        {
          $set: {
            cardDesign: updatedCardDesign,
            personalInfo,
            links,
            isPublic,
            updatedAt: new Date(),
          },
        },
      );
    } else {
      const cardCount = await cardCollection.countDocuments({ userId });

      if (cardCount >= maxCards) {
        return {
          error: `You've reached the maximum number of cards (${maxCards}) allowed on your ${currentPlan} plan!`,
        };
      }

      const now = new Date();

      const result = await cardCollection.insertOne({
        userId,
        cardDesign: updatedCardDesign,
        personalInfo,
        links,
        isPublic,
        views: 0,
        clicks: 0,
        viewHistory: [],
        clickHistory: [],
        viewFingerprint: {},
        clickFingerprint: {},
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

export async function getCardToEditBySlug(slug: string) {
  try {
    const isValidObjectId =
      ObjectId.isValid(slug) && new ObjectId(slug).toString() === slug;
    const query = isValidObjectId ? { _id: new ObjectId(slug) } : { slug };
    const [cardCollection, currentUser] = await Promise.all([
      getCardCollection(),
      session.user.get(),
    ]);

    if (!currentUser.isSignedIn || !currentUser.userId) {
      return { error: "Unauthorized!" };
    }

    const [card, cards, existingUser] = await Promise.all([
      cardCollection.findOne(query),
      cardCollection
        .find({ userId: currentUser.userId })
        .sort({ createdAt: 1 })
        .toArray(),
      getUserById(currentUser.userId),
    ]);

    if (!card) {
      return { error: "Card not found!" };
    }

    if (!existingUser) return { error: "User not found!" };

    const { currentPlan } = existingUser;
    let maxCards = constants.maxFreeCards;

    if (currentPlan === "basic") {
      maxCards = constants.maxBasicCards;
    } else if (currentPlan === "professional") {
      maxCards = constants.maxProfessionalCards;
    }

    const editableCard = cards.find(
      (c, idx) => c._id.toString() === card._id.toString() && idx < maxCards,
    );

    if (!editableCard) {
      return {
        error: `Your ${currentPlan} plan only allows editing the first ${maxCards} card(s)!`,
      };
    }

    const isOwner =
      currentUser?.isSignedIn && currentUser.userId === card.userId;

    if (!isOwner) {
      return { error: "This card belongs to another user." };
    }

    const now = new Date();
    const validProfessionalPlan = existingUser.purchasedPlans?.find(
      (plan) =>
        currentPlan === plan.planId &&
        plan.planId === "professional" &&
        new Date(plan.expiresAt) > now,
    );

    if (!validProfessionalPlan && !isValidObjectId) {
      return {
        error: "Upgrade our professional plan to access via slug.",
      };
    }

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

export async function getCardToViewBySlug(slug: string) {
  try {
    const isValidObjectId =
      ObjectId.isValid(slug) && new ObjectId(slug).toString() === slug;
    const query = isValidObjectId ? { _id: new ObjectId(slug) } : { slug };
    const card = await (await getCardCollection()).findOne(query);

    if (!card) {
      return { error: "Card not found!" };
    }

    const [currentUser, existingUser] = await Promise.all([
      session.user.get(),
      getUserById(card.userId),
    ]);
    const isOwner =
      currentUser?.isSignedIn && currentUser.userId === card.userId;

    if (!existingUser) return { error: "User not found!" };

    let { slug: dynamicSlug } = card;
    const { currentPlan } = existingUser;
    const now = new Date();
    const validBaiscPlan = existingUser.purchasedPlans?.find(
      (plan) =>
        currentPlan === plan.planId &&
        plan.planId === "basic" &&
        new Date(plan.expiresAt) > now,
    );
    const validProfessionalPlan = existingUser.purchasedPlans?.find(
      (plan) =>
        currentPlan === plan.planId &&
        plan.planId === "professional" &&
        new Date(plan.expiresAt) > now,
    );
    dynamicSlug =
      dynamicSlug && currentPlan === "professional"
        ? dynamicSlug
        : card._id.toString();

    if (!validProfessionalPlan && !isValidObjectId) {
      return {
        error: "Upgrade our professional plan to access via slug.",
      };
    }

    const usedFont = card.cardDesign.fontFamily;
    const usedColor = card.cardDesign.cardColor;

    let fontTier: "free" | "basic" | "all" | undefined;
    if (someRight(constants.freeFontOptions, (f) => f.value === usedFont)) {
      fontTier = "free";
    } else if (
      someRight(constants.basicFontOptions, (f) => f.value === usedFont)
    ) {
      fontTier = "basic";
    } else if (
      someRight(constants.allFontOptions, (f) => f.value === usedFont)
    ) {
      fontTier = "all";
    }

    let colorTier: "free" | "basic" | "all" | undefined;
    if (someRight(constants.freeColorOptions, (c) => c.value === usedColor)) {
      colorTier = "free";
    } else if (
      someRight(constants.basicColorOptions, (c) => c.value === usedColor)
    ) {
      colorTier = "basic";
    } else if (
      someRight(constants.allColorOptions, (c) => c.value === usedColor)
    ) {
      colorTier = "all";
    }

    if (
      (currentPlan === "basic" && !validBaiscPlan) ||
      currentPlan === "free"
    ) {
      if (fontTier === "basic") {
        card.cardDesign.fontFamily = constants.defaultFont;
      }
      if (colorTier === "basic") {
        card.cardDesign.cardColor = constants.defaultColor;
      }
    }

    if (
      (currentPlan === "professional" && !validProfessionalPlan) ||
      currentPlan === "free" ||
      currentPlan === "basic"
    ) {
      if (fontTier === "all") {
        card.cardDesign.fontFamily = constants.defaultFont;
      }
      if (colorTier === "all") {
        card.cardDesign.cardColor = constants.defaultColor;
      }
    }

    if (!validProfessionalPlan) {
      card.cardDesign.brandName = "Visiq";

      if (currentPlan === "basic") {
        card.links = card.links.slice(0, constants.maxBasicLinks);
      } else {
        card.links = card.links.slice(0, constants.maxFreeLinks);
      }
    }

    if (isOwner) {
      return {
        card: {
          ...card,
          _id: card._id.toString(),
          editable: false,
          message: "",
          dynamicSlug,
        } as Card & {
          editable: boolean;
          message?: string;
          dynamicSlug: string;
        },
      };
    }

    if (validProfessionalPlan && !card.isPublic) {
      return { error: "This card is private." };
    }

    return {
      card: {
        ...card,
        _id: card._id.toString(),
        editable: false,
        message: "",
        dynamicSlug,
      } as Card & {
        editable: boolean;
        message?: string;
        dynamicSlug: string;
      },
    };
  } catch (error) {
    console.error("Error getting card slug:", error);
    return { error: "Failed to get card slug! Please try again later." };
  }
}

export async function getCardByUserId(userId: string) {
  try {
    const existingUser = await (
      await getUserCollection()
    ).findOne({
      _id: new ObjectId(userId),
    });

    if (!existingUser) return { error: "User not found!" };

    const allCards = await (await getCardCollection())
      .find({ userId })
      .sort({ createdAt: 1 })
      .toArray();

    const { currentPlan } = existingUser;
    const now = new Date();
    const validProfessionalPlan = existingUser.purchasedPlans?.find(
      (plan) =>
        currentPlan === plan.planId &&
        plan.planId === "professional" &&
        new Date(plan.expiresAt) > now,
    );

    const filteredCards = validProfessionalPlan
      ? allCards.filter((card) => card.isPublic)
      : allCards;

    const slugs = filteredCards.map((card) => {
      let { slug: dynamicSlug } = card;
      dynamicSlug =
        dynamicSlug && validProfessionalPlan
          ? dynamicSlug
          : card._id.toString();
      return dynamicSlug;
    });

    return slugs;
  } catch (error) {
    console.error("Error getting card:", error);
    return { error: "Failed to get card! Please try again later." };
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
        error: "Card not found or you don't have permission to delete it!",
      };
    }

    await cardCollection.deleteOne({ _id: new ObjectId(cardId) });

    return { success: "Card deleted." };
  } catch (error) {
    console.error("Error deleting card:", error);
    return { error: "Failed to delete card! Please try again later." };
  }
}

export async function trackCardClick(
  cardId: string,
  visitorId: string,
  linkType: string,
) {
  try {
    const { isSignedIn, userId } = await session.user.get();
    const cardCollection = await getCardCollection();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const todayStr = today.toISOString().split("T")[0];
    const card = await cardCollection.findOne({ _id: new ObjectId(cardId) });

    if (!card) {
      return { error: "Card not found" };
    }

    if (
      card.clickFingerprint?.[todayStr]?.[visitorId]?.includes(linkType) ||
      (isSignedIn && userId && userId === card?.userId)
    ) {
      return { error: undefined };
    }

    if (
      card.clickHistory &&
      card.clickHistory.some((entry: { date: Date; count: number }) => {
        const entryDate = new Date(entry.date);
        return entryDate >= today && entryDate < tomorrow;
      })
    ) {
      await cardCollection.updateOne(
        {
          _id: new ObjectId(cardId),
          "clickHistory.date": {
            $gte: today,
            $lt: tomorrow,
          },
        },
        {
          $inc: {
            clicks: 1,
            "clickHistory.$.count": 1,
          },
          $addToSet: {
            [`clickFingerprint.${todayStr}.${visitorId}`]: linkType,
          },
        },
      );
    } else {
      await cardCollection.updateOne(
        { _id: new ObjectId(cardId) },
        {
          $inc: { clicks: 1 },
          $push: {
            clickHistory: {
              date: today,
              count: 1,
            },
          },
          $set: {
            [`clickFingerprint.${todayStr}.${visitorId}`]: [linkType],
          },
        },
      );
    }

    return { error: undefined };
  } catch (error) {
    console.error("Error tracking click:", error);
    return { error: "Failed to track click! Please try again later." };
  }
}

export async function trackCardView(cardId: string, visitorId: string) {
  try {
    const { isSignedIn, userId } = await session.user.get();
    const cardCollection = await getCardCollection();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const todayStr = today.toISOString().split("T")[0];
    const card = await cardCollection.findOne({ _id: new ObjectId(cardId) });

    if (!card) {
      return { error: "Card not found" };
    }

    if (
      card.viewFingerprint?.[todayStr]?.includes(visitorId) ||
      (isSignedIn && userId && userId === card?.userId)
    ) {
      return { error: undefined };
    }

    if (
      card.viewHistory &&
      card.viewHistory.some((entry: { date: Date; count: number }) => {
        const entryDate = new Date(entry.date);
        return entryDate >= today && entryDate < tomorrow;
      })
    ) {
      await cardCollection.updateOne(
        {
          _id: new ObjectId(cardId),
          "viewHistory.date": {
            $gte: today,
            $lt: tomorrow,
          },
        },
        {
          $inc: {
            views: 1,
            "viewHistory.$.count": 1,
          },
          $addToSet: {
            [`viewFingerprint.${todayStr}`]: visitorId,
          },
        },
      );
    } else {
      await cardCollection.updateOne(
        { _id: new ObjectId(cardId) },
        {
          $inc: { views: 1 },
          $push: {
            viewHistory: {
              date: today,
              count: 1,
            },
          },
          $set: {
            [`viewFingerprint.${todayStr}`]: [visitorId],
          },
        },
      );
    }

    return { error: undefined };
  } catch (error) {
    console.error("Error tracking view:", error);
    return { error: "Failed to track view! Please try again later." };
  }
}

export async function checkSlug(slug: string, cardId: string) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const cardCollection = await getCardCollection();

    const existingCard = await cardCollection.findOne({
      slug,
      _id: { $ne: new ObjectId(cardId) },
    });

    if (existingCard) {
      return { error: `Slug '${slug}' is not available!` };
    }

    return { error: undefined };
  } catch (error) {
    console.error("Error checking slug:", error);
    return { error: "Failed to check slug! Please try again later." };
  }
}

export async function updateSlug(values: SlugFormValues, cardId: string) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const parsedValues = cardSlugSchema.safeParse(values);

    if (!parsedValues.success) {
      return { error: "Invalid data provided!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) return { error: "User not found!" };
    if (existingUser.currentPlan !== "professional")
      return {
        error: "Upgrade to our professional plan to customize this card link!",
      };

    const { slug } = parsedValues.data;
    const cardCollection = await getCardCollection();
    const card = await cardCollection.findOne({ _id: new ObjectId(cardId) });

    if (!card) {
      return { error: "Card not found!" };
    }

    if (slug) {
      const { error } = await checkSlug(slug, cardId);

      if (error) {
        return { error: error };
      }
    }

    const isSame = slug === card.slug;

    if (isSame) {
      return { success: "No change was made." };
    }

    await cardCollection.updateOne(
      { _id: new ObjectId(cardId) },
      {
        $set: {
          slug,
          updatedAt: new Date(),
        },
      },
    );

    return { success: "Your slug has been changed." };
  } catch (error) {
    console.error("Error updating slug:", error);
    return { error: "Failed to update slug! Please try again later." };
  }
}

export async function updateCardVisibility(cardId: string, isPublic: boolean) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) return { error: "User not found!" };
    if (existingUser.currentPlan !== "professional")
      return {
        error:
          "Upgrade to our professional plan to change this card visibility!",
      };

    const cardCollection = await getCardCollection();

    await cardCollection.updateOne(
      { _id: new ObjectId(cardId) },
      { $set: { isPublic, updatedAt: new Date() } },
    );

    return { success: "Your card visibility has been updated." };
  } catch (error) {
    console.error("Error updating card visibility:", error);
    return {
      error: "Failed to update card visibility! Please try again later.",
    };
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

    const { currentPlan } = existingUser;
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

    const enhancedCards = cards.map((c, idx) => {
      const editable = idx < maxCards;
      const message = editable
        ? undefined
        : `Your ${currentPlan} plan only allows editing the first ${maxCards} card(s)!`;
      let { slug: dynamicSlug } = c;

      dynamicSlug =
        dynamicSlug && currentPlan === "professional"
          ? dynamicSlug
          : c._id.toString();

      return {
        ...c,
        _id: c._id.toString(),
        editable,
        message,
        dynamicSlug,
      };
    }) as (Card & {
      editable: boolean;
      message?: string;
      dynamicSlug: string;
    })[];

    if (cardCount >= maxCards) {
      return {
        error: `You've reached the maximum number of cards (${maxCards}) allowed on your ${currentPlan} plan!`,
        cards: enhancedCards,
      };
    }

    return {
      error: undefined,
      cards: enhancedCards,
    };
  } catch (error) {
    console.error("Error getting card:", error);
    return {
      error: "Failed to get card! Please try again later.",
    };
  }
}
