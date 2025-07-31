"use client"

import { useState } from "react"
import Link from "next/link"
import * as constants from "@/constants"
import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CardDesign,
  type CardDesignValues,
} from "@/components/card/card-design"
import { CardPreview } from "@/components/card/card-preview"
import { Links } from "@/components/card/links"
import {
  PersonalInformation,
  type PersonalInformationValues,
} from "@/components/card/personal-information"
import type { SerializableLinkType } from "@/components/icons"

const demoCardDesign: CardDesignValues = {
  cardColor: constants.defaultColor,
  fontFamily: constants.defaultFont,
  logoImage: [
    "duobwq5xg",
    "v1747620720/digital-business-card/logo/leid7yrr9f1wljyp2svp.png",
  ],
  profileImage: [
    "duobwq5xg",
    "v1747137735/business-cards/profile/quspaw8scggryuzskvb1.jpg",
  ],
  coverImage: [
    "duobwq5xg",
    "v1748320039/digital-business-card/cover/xfnk3hybkdcafo6gnp9d.jpg",
  ],
  brandName: "Visiq",
  imageTransforms: {
    profile: {
      scale: 1,
      positionX: 0,
      positionY: 0,
      croppedAreaPixels: {
        width: 460,
        height: 460,
        x: 0,
        y: 0,
      },
      naturalWidth: 460,
      naturalHeight: 460,
      croppedImageUrl: "/images/demo/profile-picture.jpeg",
    },
    logo: {
      scale: 1,
      positionX: 0,
      positionY: 0,
      croppedAreaPixels: {
        width: 456,
        height: 456,
        x: 0,
        y: 0,
      },
      naturalWidth: 456,
      naturalHeight: 456,
      croppedImageUrl: "/images/demo/company-logo.png",
    },
    cover: {
      scale: 1,
      positionX: 0,
      positionY: 0,
      croppedAreaPixels: {
        width: 1486,
        height: 743,
        x: 0,
        y: 130,
      },
      naturalWidth: 1486,
      naturalHeight: 1003,
      croppedImageUrl: "/images/demo/cover-photo.jpg",
    },
  },
}

const demoPersonalInformation: PersonalInformationValues = {
  fullName: "Hoàng Anh Tuấn",
  jobTitle: "Software Engineer",
  department: "Research & Development",
  company: "NextTech Solutions",
  accreditations: "MBA, CPA",
  headline: "Software Engineer with 1+ year of experience.",
  bio: "Software Engineer with skills in full-stack development, cloud computing, and system design.",
}

const demoLinks: SerializableLinkType[] = [
  {
    id: "1",
    type: "GitHub",
    value: "https://github.com/iwmywn",
    category: "Business",
  },
]

export function HowItWorksSection() {
  const [designActiveTab, setDesignActiveTab] = useState<string>("design")
  const [planActiveTab, setPlanActiveTab] = useState<string>("free")
  const [cardDesign, setCardDesign] = useState<CardDesignValues>(demoCardDesign)
  const [personalInformation, setPersonalInformation] =
    useState<PersonalInformationValues>(demoPersonalInformation)
  const [links, setLinks] = useState<SerializableLinkType[]>(demoLinks)

  const handlePlanActiveTab = (tab: string) => {
    setPlanActiveTab(tab)
    setCardDesign({
      ...cardDesign,
      cardColor: constants.defaultColor,
      fontFamily: constants.defaultFont,
      brandName: tab === "professional" ? "iwmywn" : "Visiq",
    })
    setLinks(
      tab === "free"
        ? links.slice(0, constants.maxFreeLinks)
        : tab === "basic"
          ? links.slice(0, constants.maxBasicLinks)
          : links.slice(0, constants.maxProfessionalLinks)
    )
  }

  return (
    <section
      id="how-it-works"
      className="relative flex min-h-screen flex-col items-center justify-center py-16 md:py-20 lg:py-24"
    >
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          How It Works
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
          Customize your card with just a few clicks - choose fonts, colors, and
          more to match your style.
        </p>

        <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="w-full space-y-6 lg:sticky lg:top-16 lg:col-span-2">
            <div className="space-y-3">
              <Label className="text-base" asChild>
                <div>Subscription Plans</div>
              </Label>
              <Tabs
                value={planActiveTab}
                onValueChange={(tab) => handlePlanActiveTab(tab)}
              >
                <div className="hidden w-full overflow-x-auto md:block">
                  <TabsList className="w-full min-w-[19.5rem]">
                    <TabsTrigger value="free">Free</TabsTrigger>
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="professional">Professional</TabsTrigger>
                  </TabsList>
                </div>

                <Select
                  value={planActiveTab}
                  onValueChange={(tab) => handlePlanActiveTab(tab)}
                >
                  <SelectTrigger
                    className="flex w-full md:hidden"
                    aria-label="Plan selection"
                  >
                    <SelectValue placeholder="Select a subscription plan..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>

                <div className="sr-only">
                  <TabsContent value="free" />
                  <TabsContent value="basic" />
                  <TabsContent value="professional" />
                </div>
              </Tabs>
            </div>

            <Card className="h-full">
              <CardContent className="space-y-6">
                <Tabs
                  value={designActiveTab}
                  onValueChange={setDesignActiveTab}
                >
                  <div className="hidden w-full overflow-x-auto md:block">
                    <TabsList className="w-full min-w-[30.75rem]">
                      <TabsTrigger value="design">Design</TabsTrigger>
                      <TabsTrigger value="personal-information">
                        Personal Information
                      </TabsTrigger>
                      <TabsTrigger value="links">Links</TabsTrigger>
                    </TabsList>
                  </div>

                  <Select
                    value={designActiveTab}
                    onValueChange={setDesignActiveTab}
                  >
                    <SelectTrigger
                      className="flex w-full md:hidden"
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
                      key={planActiveTab}
                      onSave={setCardDesign}
                      initialValues={cardDesign}
                      publicPlan={
                        planActiveTab as "free" | "basic" | "professional"
                      }
                    />
                  </TabsContent>

                  <TabsContent
                    value="personal-information"
                    className="space-y-4 pt-4"
                  >
                    <PersonalInformation
                      onSave={setPersonalInformation}
                      initialValues={personalInformation}
                    />
                  </TabsContent>

                  <TabsContent value="links" className="space-y-4 pt-4">
                    <Links
                      key={planActiveTab}
                      onSave={setLinks}
                      initialLinks={links}
                      publicPlan={
                        planActiveTab as "free" | "basic" | "professional"
                      }
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/signup">Create Your Own Card</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="w-full lg:sticky lg:top-16">
            <CardPreview
              cardDesign={cardDesign}
              personalInformation={personalInformation}
              links={links}
            />
          </div>
        </div>

        <Button className="sm:mx-auto sm:w-fit" asChild>
          <Link href="/card/iwmywn" target="_blank">
            See Full Demo
            <ExternalLink />
          </Link>
        </Button>
      </div>
    </section>
  )
}
