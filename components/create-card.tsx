"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CardDesign, type CardDesignValues } from "@/components/card-design";
import {
  PersonalInformation,
  type PersonalInformationValues,
} from "@/components/personal-information";
import { Links } from "@/components/links";
import { CardPreview } from "@/components/card-preview";
import { saveCard } from "@/actions/card";
import type { SerializableLinkType } from "@/components/icons";
import { useCard, useUser } from "@/lib/swr";
import { CreateCardSkeleton } from "@/components/skeletons";
import { Loading } from "@/components/loading";
import * as constants from "@/constants";
import { brandNameSchema, personalInformationSchema } from "@/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateCard() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("design");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cardDesign, setCardDesign] = useState<CardDesignValues>({
    cardColor: constants.defaultColor,
    fontFamily: constants.defaultFont,
    logoImage: undefined,
    profileImage: undefined,
    coverImage: undefined,
    brandName: "Visiq",
  });
  const [personalInformation, setPersonalInformation] =
    useState<PersonalInformationValues>({
      fullName: "",
      jobTitle: "",
      department: "",
      company: "",
      accreditations: "",
      headline: "",
      bio: "",
    });
  const [links, setLinks] = useState<SerializableLinkType[]>([]);
  const personalInformationRef = useRef<{ validate: () => Promise<boolean> }>(
    null,
  );
  const cardDesignRef = useRef<{ validate: () => Promise<boolean> }>(null);
  const { cardResponse, cards, isCardLoading, isCardError, mutate } = useCard();
  const { isUserError, isUserLoading, user } = useUser();
  const [isPublic, setIsPublic] = useState<boolean>(true);

  async function handleCreateCard() {
    if (isSubmitting) return;

    const parsedCardDesignValue = brandNameSchema.safeParse({
      brandName: cardDesign.brandName,
    });
    const parsedPersonalInfoValues =
      personalInformationSchema.safeParse(personalInformation);

    if (!parsedCardDesignValue.success) {
      setActiveTab("design");
      setTimeout(async () => {
        await cardDesignRef.current?.validate();
      }, 0);
      router.push(`${pathname}#brandName`);
      return;
    }

    if (!parsedPersonalInfoValues.success) {
      setActiveTab("personal-information");
      setTimeout(async () => {
        await personalInformationRef.current?.validate();
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
      personalInformation,
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
            personalInformation,
            links,
            isPublic,
            views: 0,
            clicks: 0,
            viewHistory: [],
            clickHistory: [],
            viewFingerprint: {},
            clickFingerprint: {},
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

  useEffect(() => {
    if (
      isCardError &&
      !isCardError.includes("You've reached the maximum number of cards") &&
      !isCardLoading
    )
      toast.error(isCardError);
    if (isUserError && !isUserLoading) {
      toast.error(isUserError);
    }
  }, [isCardError, isUserError, isUserLoading, isCardLoading]);

  if (isCardLoading || isUserLoading) return <CreateCardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="bg-primary-foreground/75 sticky top-[3.25rem] z-50 flex flex-col gap-6 backdrop-blur-xs backdrop-saturate-150 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {previewMode ? "Card Preview" : "Create Card"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {previewMode
              ? "Preview how your digital business card will look."
              : "Design your digital business card."}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {user?.currentPlan === "professional" && (
            <Button onClick={() => setIsPublic(!isPublic)}>
              {isPublic ? "Public" : "Private"}
            </Button>
          )}
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
        <div className="sticky">
          <CardPreview
            cardDesign={cardDesign}
            personalInformation={personalInformation}
            links={links}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="xl:sticky xl:top-[7.75rem]"
            >
              <div className="hidden w-full overflow-x-auto sm:block">
                <TabsList className="w-full min-w-[30.75rem]">
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="personal-information">
                    Personal Information
                  </TabsTrigger>
                  <TabsTrigger value="links">Links</TabsTrigger>
                </TabsList>
              </div>

              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger
                  className="flex w-full sm:hidden"
                  aria-label="Card design selection"
                >
                  <SelectValue placeholder="Select a section to customize..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="personal-information">
                    Personal Information
                  </SelectItem>
                  <SelectItem value="links">Links</SelectItem>
                </SelectContent>
              </Select>

              <TabsContent value="design" className="space-y-4 pt-4">
                <CardDesign
                  onSave={setCardDesign}
                  initialValues={cardDesign}
                  currentUserPlan={user?.currentPlan}
                  ref={cardDesignRef}
                />
              </TabsContent>

              <TabsContent
                value="personal-information"
                className="space-y-4 pt-4"
              >
                <PersonalInformation
                  onSave={setPersonalInformation}
                  initialValues={personalInformation}
                  ref={personalInformationRef}
                />
              </TabsContent>

              <TabsContent value="links" className="space-y-4 pt-4">
                <Links
                  onSave={setLinks}
                  initialLinks={links}
                  currentUserPlan={user?.currentPlan}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden xl:block">
            <div className="sticky top-[7.75rem] space-y-4">
              <CardPreview
                cardDesign={cardDesign}
                personalInformation={personalInformation}
                links={links}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
