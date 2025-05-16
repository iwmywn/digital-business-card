"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CardDesign, type CardDesignValues } from "@/components/card-design";
import {
  PersonalInfo,
  type PersonalInfoValues,
} from "@/components/personal-info";
import { Links } from "@/components/links";
import { CardPreview } from "@/components/card-preview";
import { saveCard } from "@/actions/card";
import type { SerializableLinkType } from "@/components/icons";
import { useCard } from "@/lib/swr";
import { CreateCardSkeleton } from "@/components/skeletons";
import { Loading } from "@/components/loading";
import * as constants from "@/constants";
import { personalInfoSchema } from "@/schemas";

export function CreateCard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("design");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cardDesign, setCardDesign] = useState<CardDesignValues>({
    cardColor: constants.defaultColor,
    fontFamily: constants.defaultFont,
    logoImage: undefined,
    profileImage: undefined,
    coverImage: undefined,
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoValues>({
    fullName: "",
    jobTitle: "",
    department: "",
    company: "",
    accreditations: "",
    headline: "",
    bio: "",
  });
  const [links, setLinks] = useState<SerializableLinkType[]>([]);
  const personalInfoRef = useRef<{ validate: () => Promise<boolean> }>(null);
  const { cardResponse, cards, isCardLoading, isCardError, mutate } = useCard();
  const [isPublic, setIsPublic] = useState<boolean>(true);

  async function handleCreateCard() {
    if (isSubmitting) return;

    const parsedValues = personalInfoSchema.safeParse(personalInfo);

    if (!parsedValues.success) {
      setActiveTab("personal");
      setTimeout(async () => {
        await personalInfoRef.current?.validate();
      }, 0);
      return;
    }

    const emptyLinks = links.filter((link) => !link.value.trim());
    if (emptyLinks.length > 0) {
      toast.error(
        "Please provide values for all your links or remove empty ones!",
      );
      setActiveTab("links");
      return;
    }

    setIsSubmitting(true);

    const { success, error } = await saveCard(
      cardDesign,
      personalInfo,
      links,
      isPublic,
    );

    if (error || !success) {
      toast.error(error);
    } else {
      mutate({
        ...cardResponse,
        cards: [
          ...cards,
          {
            _id: "temp",
            userId: "temp",
            slug: "temp",
            cardDesign,
            personalInfo,
            links,
            isPublic,
            views: 0,
            clicks: 0,
            viewHistory: [],
            clickHistory: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            editable: true,
            message: undefined,
            dynamicSlug: "temp",
          },
        ],
      });
      toast.success(success);
      router.push("/management");
    }

    setIsSubmitting(false);
  }

  const handleCardDesignUpdate = useCallback((data: CardDesignValues) => {
    setCardDesign(data);
  }, []);

  const handlePersonalInfoUpdate = useCallback((data: PersonalInfoValues) => {
    setPersonalInfo(data);
  }, []);

  const handleLinksUpdate = useCallback((data: SerializableLinkType[]) => {
    setLinks(data);
  }, []);

  useEffect(() => {
    if (
      isCardError &&
      !isCardError.includes("You've reached the maximum number of cards")
    )
      toast.error(isCardError);
  }, [isCardError]);

  if (isCardLoading) return <CreateCardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {previewMode ? "Card Preview" : "Create Card"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {previewMode
              ? "Preview how your digital business card will look"
              : "Design your digital business card"}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => setIsPublic(!isPublic)}>
            {isPublic ? "Public" : "Private"}
          </Button>
          <Button onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? "Back to editor" : "Preview card"}
          </Button>
          {!isCardError && (
            <Button onClick={handleCreateCard} disabled={isSubmitting}>
              {isSubmitting ? <Loading /> : "Create card"}
            </Button>
          )}
        </div>
      </div>

      {isCardError && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Card Limit Reached</AlertTitle>
          <AlertDescription>{isCardError}</AlertDescription>
        </Alert>
      )}

      {previewMode ? (
        <div className="flex justify-center">
          <CardPreview
            cardDesign={cardDesign}
            personalInfo={personalInfo}
            links={links}
            size="large"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-4 pt-4">
                <CardDesign
                  onSave={handleCardDesignUpdate}
                  initialValues={cardDesign}
                />
              </TabsContent>

              <TabsContent value="personal" className="space-y-4 pt-4">
                <PersonalInfo
                  onSave={handlePersonalInfoUpdate}
                  initialValues={personalInfo}
                  ref={personalInfoRef}
                />
              </TabsContent>

              <TabsContent value="links" className="space-y-4 pt-4">
                <Links onSave={handleLinksUpdate} initialLinks={links} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden xl:block">
            <div className="sticky top-[3.75rem] space-y-4">
              <CardPreview
                cardDesign={cardDesign}
                personalInfo={personalInfo}
                links={links}
                size="small"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
