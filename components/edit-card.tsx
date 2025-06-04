"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CardDesign, type CardDesignValues } from "@/components/card-design";
import {
  PersonalInformation,
  type PersonalInformationValues,
} from "@/components/personal-information";
import { Links } from "@/components/links";
import { CardPreview } from "@/components/card-preview";
import { saveCard } from "@/actions/card";
import type { SerializableLinkType } from "@/components/icons";
import type { Card as CardType } from "@/lib/definitions";
import { useCard, useUser } from "@/lib/swr";
import { Loading } from "@/components/loading";
import { brandNameSchema, personalInformationSchema } from "@/schemas";
import { CreateCardSkeleton } from "@/components/skeletons";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EditCard({ card }: { card: CardType }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("design");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cardDesign, setCardDesign] = useState<CardDesignValues>(
    card.cardDesign,
  );
  const [personalInfo, setPersonalInfo] = useState<PersonalInformationValues>(
    card.personalInfo,
  );
  const [isPublic, setIsPublic] = useState<boolean>(card.isPublic);
  const [links, setLinks] = useState<SerializableLinkType[]>(card.links);
  const personalInfoRef = useRef<{ validate: () => Promise<boolean> }>(null);
  const cardDesignRef = useRef<{ validate: () => Promise<boolean> }>(null);
  const { cardResponse, mutate, cards, isCardLoading, isCardError } = useCard();
  const { isUserError, isUserLoading, user } = useUser();

  async function handleUpdateCard() {
    if (isSubmitting) return;

    const parsedCardDesignValue = brandNameSchema.safeParse({
      brandName: cardDesign.brandName,
    });
    const parsedPersonalInfoValues =
      personalInformationSchema.safeParse(personalInfo);

    if (!parsedCardDesignValue.success) {
      setActiveTab("design");
      setTimeout(async () => {
        await cardDesignRef.current?.validate();
      }, 0);
      router.push(`${pathname}#brandName`);
      return;
    }

    if (!parsedPersonalInfoValues.success) {
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
      card._id,
    );

    if (error || !success) {
      toast.error(error);
    } else {
      mutate({
        ...cardResponse,
        cards: cards.map((c) =>
          c._id === card._id
            ? {
                ...c,
                cardDesign,
                personalInfo,
                links,
                isPublic,
                updatedAt: new Date(),
              }
            : c,
        ),
      });
      toast.success(success);
      router.push("/management");
    }

    setIsSubmitting(false);
  }

  const handleCardDesignUpdate = useCallback((data: CardDesignValues) => {
    setCardDesign(data);
  }, []);

  const handlePersonalInfoUpdate = useCallback(
    (data: PersonalInformationValues) => {
      setPersonalInfo(data);
    },
    [],
  );

  const handleLinksUpdate = useCallback((data: SerializableLinkType[]) => {
    setLinks(data);
  }, []);

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
            {previewMode ? "Card Preview" : "Edit Card"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {previewMode
              ? "Preview how your digital business card will look."
              : "Update your digital business card design."}
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
          <Button onClick={handleUpdateCard} disabled={isSubmitting}>
            {isSubmitting ? <Loading /> : "Save changes"}
          </Button>
          <Button asChild>
            <Link href="/management">Discard changes</Link>
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="sticky">
          <CardPreview
            cardDesign={cardDesign}
            personalInfo={personalInfo}
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
                  onSave={handleCardDesignUpdate}
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
                  onSave={handlePersonalInfoUpdate}
                  initialValues={personalInfo}
                  ref={personalInfoRef}
                />
              </TabsContent>

              <TabsContent value="links" className="space-y-4 pt-4">
                <Links
                  onSave={handleLinksUpdate}
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
                personalInfo={personalInfo}
                links={links}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
