"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { CardDesign, type CardDesignValues } from "@/components/card-design";
import {
  PersonalInfo,
  type PersonalInfoValues,
} from "@/components/personal-info";
import { Links } from "@/components/links";
import type { LinkType } from "@/components/icons";
import { CardPreview } from "@/components/card-preview";

export function CreateCard() {
  const [activeTab, setActiveTab] = useState("design");
  const [previewMode, setPreviewMode] = useState(false);

  const [cardDesign, setCardDesign] = useState<CardDesignValues>({
    cardColor: "red",
    fontFamily: "inter",
    logoImage: null,
    profileImage: null,
    coverImage: null,
  });

  const [personalInfo, setPersonalInfo] = useState<PersonalInfoValues>({
    fullName: "Hoàng Anh Tuấn",
    jobTitle: "Software Engineer",
    department: "Research & Development",
    company: "NextTech Solutions",
    accreditations: "MBA, CPA",
    headline: "",
    bio: "Software engineer with strong skills in full-stack development, cloud computing, and system design.",
  });

  const [links, setLinks] = useState<LinkType[]>([]);

  function saveCard() {
    toast.success("Business card saved successfully!");
  }

  const handleCardDesignUpdate = React.useCallback((data: CardDesignValues) => {
    setCardDesign(data);
  }, []);

  const handlePersonalInfoUpdate = React.useCallback(
    (data: PersonalInfoValues) => {
      setPersonalInfo(data);
    },
    [],
  );

  const handleLinksUpdate = React.useCallback((data: LinkType[]) => {
    setLinks(data);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {previewMode ? "Card Preview" : "Create New Card"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {previewMode
              ? "Preview how your digital business card will look"
              : "Design your digital business card"}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? "Back to Editor" : "Preview Card"}
          </Button>
          <Button onClick={saveCard}>Save Card</Button>
        </div>
      </div>

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
