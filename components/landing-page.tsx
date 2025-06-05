"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ExternalLink,
  QrCode,
  Sparkles,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardPreview } from "@/components/card-preview";
import { subscriptionPlans } from "@/constants";
import type { SerializableLinkType } from "@/components/icons";
import * as constants from "@/constants";
import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CardDesign, CardDesignValues } from "@/components/card-design";
import { Label } from "@/components/ui/label";
import { SimpleIconComponent } from "@/components/icons";
import { siFacebook, siInstagram, siX } from "simple-icons";
import {
  PersonalInformation,
  PersonalInformationValues,
} from "@/components/personal-information";
import { Separator } from "@/components/ui/separator";
import { TermsOfServiceDialog } from "@/components/terms-of-service-dialog";
import { PrivacyPolicyDialog } from "@/components/privacy-policy-dialog";
import { FAQDialog } from "@/components/faq-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Links } from "@/components/links";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Marketing Director",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1974",
    quote:
      "Visiq has completely transformed how I network at events. No more fumbling for paper cards or running out. I just share my QR code and track who actually views my information.",
  },
  {
    name: "Michael Chen",
    title: "Startup Founder",
    image:
      "https://images.unsplash.com/photo-1557977275-d261356f567f?q=80&w=1998",
    quote:
      "As a founder, I'm always networking. Visiq has saved me time and money while making my company look more professional. The analytics feature is a game-changer for follow-ups.",
  },
  {
    name: "Priya Patel",
    title: "Sales Executive",
    image:
      "https://images.unsplash.com/photo-1526510747491-58f928ec870f?q=80&w=1974",
    quote:
      "My entire sales team uses Visiq now. We've seen a 40% increase in follow-up conversions since we can track who engages with our cards and when to time our outreach perfectly.",
  },
  {
    name: "Robert Williams",
    title: "Real Estate Agent",
    image:
      "https://images.unsplash.com/photo-1652278860289-090c869605af?q=80&w=1974",
    quote:
      "In real estate, first impressions matter. My digital business card sets me apart from other agents and gives clients an easy way to save my contact info and listings.",
  },
  {
    name: "Emma Thompson",
    title: "Freelance Designer",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974",
    quote:
      "As a freelancer, my digital card doubles as a mini-portfolio. I can showcase my work and make it easy for potential clients to contact me. It's been a great investment.",
  },
  {
    name: "David Rodriguez",
    title: "IT Consultant",
    image:
      "https://images.unsplash.com/photo-1626978407649-de62156f1548?q=80&w=1974",
    quote:
      "I've tried several digital card solutions, but Visiq offers the best balance of features and simplicity. The QR code scanning works flawlessly every time.",
  },
  {
    name: "Jennifer Lee",
    title: "Event Coordinator",
    image:
      "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=1826",
    quote:
      "For someone who attends and organizes networking events, Visiq has been invaluable. I can quickly share my details with dozens of people without any hassle.",
  },
  {
    name: "Thomas Wright",
    title: "Financial Advisor",
    image:
      "https://images.unsplash.com/photo-1679217125041-6f81624038d4?q=80&w=1974",
    quote:
      "My clients appreciate the professional look of my digital card. It reinforces their confidence in my services and makes me stand out from other advisors.",
  },
  {
    name: "Sophia Martinez",
    title: "Healthcare Professional",
    image:
      "https://images.unsplash.com/photo-1647235261184-9e8f8d316847?q=80&w=1964",
    quote:
      "In healthcare, being able to quickly share my credentials and contact information with patients is crucial. Visiq makes this process seamless and professional.",
  },
  {
    name: "James Wilson",
    title: "Photographer",
    image:
      "https://images.unsplash.com/photo-1652278860435-67030231c138?q=80&w=1976",
    quote:
      "As a visual professional, I love how Visiq lets me showcase my portfolio directly from my digital card. It's like carrying my gallery in my pocket.",
  },
  {
    name: "Olivia Brown",
    title: "HR Manager",
    image:
      "https://images.unsplash.com/photo-1575439462433-8e1969065df7?q=80&w=1974",
    quote:
      "Our entire HR department uses Visiq for recruiting events. It's made our follow-up process much more efficient and improved our candidate experience.",
  },
  {
    name: "Daniel Kim",
    title: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1698510047345-ff32de8a3b74?q=80&w=1992",
    quote:
      "The technical implementation of Visiq is impressive. As a developer, I appreciate the attention to detail and the seamless user experience they've created.",
  },
];

export function LandingPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const isIPad = useMediaQuery("(max-width: 1024px)");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const howItWorksRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      watchDrag: isIPad,
    },
    isIPad
      ? []
      : [
          AutoScroll({
            speed: 0.5,
            startDelay: 0,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ],
  );
  const [designActiveTab, setDesignActiveTab] = useState<string>("design");
  const [planActiveTab, setPlanActiveTab] = useState<string>("free");
  const [cardDesign, setCardDesign] = useState<CardDesignValues>({
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
        croppedImageUrl: "/images/profile-picture.jpeg",
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
        croppedImageUrl: "/images/company-logo.png",
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
        croppedImageUrl: "/images/cover-photo.jpg",
      },
    },
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInformationValues>({
    fullName: "Hoàng Anh Tuấn",
    jobTitle: "Software Engineer",
    department: "Research & Development",
    company: "NextTech Solutions",
    accreditations: "MBA, CPA",
    headline: "Software Engineer with 1+ year of experience.",
    bio: "Software Engineer with skills in full-stack development, cloud computing, and system design.",
  });
  const [links, setLinks] = useState<SerializableLinkType[]>([
    {
      id: "1",
      type: "GitHub",
      value: "https://github.com/iwmywn",
      category: "Business",
    },
  ]);
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

  const filteredTestimonials = isIPad ? testimonials.slice(0, 6) : testimonials;

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 63,
        behavior: "smooth",
      });
    }
  };

  const handleMenuClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsDrawerOpen(false);
  };

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const handlePlanActiveTab = (tab: string) => {
    setPlanActiveTab(tab);
    setCardDesign({
      ...cardDesign,
      cardColor: constants.defaultColor,
      fontFamily: constants.defaultFont,
      brandName: tab === "professional" ? "iwmywn" : "Visiq",
    });
    setLinks(
      tab === "free"
        ? links.slice(0, constants.maxFreeLinks)
        : tab === "basic"
          ? links.slice(0, constants.maxBasicLinks)
          : links.slice(0, constants.maxProfessionalLinks),
    );
  };

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);

    return () => {
      emblaApi
        .off("reInit", onInit)
        .off("reInit", onSelect)
        .off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const sections = [
          { id: "how-it-works", ref: howItWorksRef },
          { id: "features", ref: featuresRef },
          { id: "pricing", ref: pricingRef },
          { id: "testimonials", ref: testimonialsRef },
        ];

        let found = false;

        for (const section of sections) {
          const el = section.ref.current;
          if (el) {
            const rect = el.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 64) {
              setActiveSection(section.id);
              found = true;
              break;
            }
          }
        }

        if (!found) {
          setActiveSection(null);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="min-h-screen" data-vaul-drawer-wrapper>
        <header className="bg-background/75 sticky top-0 z-50 flex shrink-0 items-center justify-between border-b backdrop-blur-xs backdrop-saturate-150">
          <div className="flex h-16 w-full items-center justify-between px-6 md:px-8 lg:px-10">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-extrabold"
            >
              <Image
                src="/images/logo.png"
                alt="Visiq Logo"
                width={24}
                height={24}
                className="rounded-lg"
              />
              <span className="sr-only sm:not-sr-only">Visiq</span>
            </Link>
            <nav className="hidden gap-8 lg:flex">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className={`text-sm font-medium transition-colors ${activeSection === "how-it-works" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className={`text-sm font-medium transition-colors ${activeSection === "features" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className={`text-sm font-medium transition-colors ${activeSection === "pricing" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className={`text-sm font-medium transition-colors ${activeSection === "testimonials" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Testimonials
              </button>
            </nav>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                asChild
              >
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button size="sm" className="hidden sm:inline-flex" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden"
              >
                <Menu />
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </header>
        <main id="landing-page" className="w-full px-6 md:px-8 lg:px-10">
          <section className="bg-secondary dark:bg-card mb-1 flex min-h-screen flex-col items-center justify-center gap-12 px-4 min-[31.25rem]:[clip-path:polygon(0%_15%,100%_0%,100%_85%,0%_100%)] md:px-6 lg:px-8">
            <h1 className="text-center text-[clamp(2.25rem,5vw+1rem,4.5rem)] leading-[1.1] font-black tracking-tight">
              Connect Instantly <br />
              with Digital Business Cards
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
              Share your contact information with a simple scan. Create
              customizable digital business cards that make networking
              effortless and leave a lasting impression.
            </p>
            <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/signup">
                  Create Your Card
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => scrollToSection("how-it-works")}
              >
                Learn More
              </Button>
            </div>
          </section>

          <section
            id="how-it-works"
            ref={howItWorksRef}
            className="relative py-16 md:py-20 lg:py-24"
          >
            <div className="flex flex-col gap-6">
              <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
                Customize your card with just a few clicks - choose fonts,
                colors, and more to match your style.
              </p>

              <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                <div className="w-full space-y-6 lg:sticky lg:top-16 lg:col-span-2">
                  <div className="space-y-3">
                    <Label className="text-base">Subscription Plans</Label>
                    <Tabs
                      value={planActiveTab}
                      onValueChange={(tab) => handlePlanActiveTab(tab)}
                    >
                      <div className="hidden w-full overflow-x-auto md:block">
                        <TabsList className="w-full min-w-[19.5rem]">
                          <TabsTrigger value="free">Free</TabsTrigger>
                          <TabsTrigger value="basic">Basic</TabsTrigger>
                          <TabsTrigger value="professional">
                            Professional
                          </TabsTrigger>
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
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
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
                            onSave={handleCardDesignUpdate}
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
                            onSave={handlePersonalInfoUpdate}
                            initialValues={personalInfo}
                          />
                        </TabsContent>

                        <TabsContent value="links" className="space-y-4 pt-4">
                          <Links
                            key={planActiveTab}
                            onSave={handleLinksUpdate}
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
                    personalInfo={personalInfo}
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

          <section
            id="features"
            ref={featuresRef}
            className="bg-secondary dark:bg-card py-16 [clip-path:polygon(0%_5%,5%_0%,95%_0%,100%_5%,100%_95%,95%_100%,5%_100%,0%_95%)] md:py-20 lg:py-24"
          >
            <div className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
              <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need in a Digital Business Card
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
                Visiq provides all the tools you need to create, share, and
                manage your digital presence professionally.
              </p>
              <div className="[&>div]:hover:ring-primary mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 [&>div]:hover:ring-1 [&>div]:hover:ring-offset-1">
                <Card>
                  <CardHeader>
                    <QrCode className="text-primary mb-2 h-10 w-10" />
                    <CardTitle>Instant Sharing</CardTitle>
                    <CardDescription>
                      Share your contact information instantly with a QR code
                      that can be scanned by any smartphone.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mb-2 h-10 w-10"
                    >
                      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                      <path d="M12 18h.01" />
                    </svg>
                    <CardTitle>Mobile Optimized</CardTitle>
                    <CardDescription>
                      Your digital business card looks great on any device,
                      ensuring a professional experience for everyone.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mb-2 h-10 w-10"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <CardTitle>Real-time Updates</CardTitle>
                    <CardDescription>
                      Update your information anytime and it&apos;s instantly
                      reflected on your digital card.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mb-2 h-10 w-10"
                    >
                      <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6" />
                      <path d="M14 3v5h5" />
                      <circle cx="16" cy="16" r="6" />
                      <path d="M16 14v4" />
                      <path d="M16 20h.01" />
                    </svg>
                    <CardTitle>Analytics & Insights</CardTitle>
                    <CardDescription>
                      Track who views your card and gain valuable insights about
                      your networking efforts.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mb-2 h-10 w-10"
                    >
                      <path d="M12 2H2v10h10V2z" />
                      <path d="M22 12h-10v10h10V12z" />
                      <path d="M12 12H2v10h10V12z" />
                      <path d="M22 2h-10v10h10V2z" />
                    </svg>
                    <CardTitle>Customizable Design</CardTitle>
                    <CardDescription>
                      Choose from multiple templates and customize colors,
                      fonts, and layouts to match your brand.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mb-2 h-10 w-10"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <CardTitle>Privacy Controls</CardTitle>
                    <CardDescription>
                      Control who sees your information with advanced privacy
                      settings and permissions.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>

          <section
            id="pricing"
            ref={pricingRef}
            className="relative py-16 md:py-20 lg:py-24"
          >
            <div className="flex flex-col gap-6">
              <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
                Choose the plan that&apos;s right for you, from individual
                professionals to large teams.
              </p>
              <div className="mt-6 flex flex-col flex-wrap justify-center gap-6 min-[25rem]:flex-row">
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={
                      "hover:ring-primary relative max-w-sm flex-1 overflow-hidden shadow-sm transition-all duration-200 hover:ring-1 hover:ring-offset-1 min-[25rem]:min-w-[17.5rem]"
                    }
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-primary text-primary-foreground flex items-center gap-1 rounded-bl-lg px-3 py-1 text-xs font-medium">
                          <Sparkles className="h-3 w-3" />
                          Popular
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="flex items-baseline">
                        <span className="text-base font-bold">
                          {plan.price === 0
                            ? "Free forever"
                            : `$${plan.price.toFixed(2)} / month`}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="text-primary mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/signup">
                          {plan.id === "free" ? "Get Started" : "Upgrade"}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section
            id="testimonials"
            key={filteredTestimonials.length}
            ref={testimonialsRef}
            className="bg-secondary dark:bg-card overflow-hidden rounded-[5rem] py-16 md:py-20 lg:py-24"
          >
            <div className="relative flex flex-col items-center gap-6 [&>h2,p]:mx-4 md:[&>h2,p]:mx-6 lg:[&>h2,p]:mx-8">
              <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
                Join thousands of professionals who are already using Visiq to
                enhance their networking.
              </p>

              <div className="from-background pointer-events-none absolute -top-17 -bottom-17 left-0 z-10 hidden w-20 bg-gradient-to-r to-transparent md:-top-21 md:-bottom-21 lg:-top-25 lg:-bottom-25 lg:block" />
              <div className="from-background pointer-events-none absolute -top-17 right-0 -bottom-17 z-10 hidden w-20 bg-gradient-to-l to-transparent md:-top-21 md:-bottom-21 lg:-top-25 lg:-bottom-25 lg:block" />
              <div className="relative mx-auto mt-6 w-full">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div
                    className="flex items-stretch py-1 will-change-transform"
                    style={{
                      touchAction: "pan-y pinch-zoom",
                      backfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {filteredTestimonials.map((testimonial, index) => (
                      <Card
                        key={index}
                        className={`hover:ring-primary mr-4 min-w-fit transition-all will-change-transform hover:ring-1 hover:ring-offset-1 ${isIPad ? "cursor-pointer" : ""}`}
                        style={{ transform: "translate3d(0,0,0)" }}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 overflow-hidden rounded-full">
                              <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                width={56}
                                height={56}
                              />
                            </div>
                            <div className="text-primary">
                              <CardTitle className="text-lg">
                                {testimonial.name}
                              </CardTitle>
                              <CardDescription>
                                {testimonial.title}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="max-w-96">
                          <span className="text-muted-foreground">
                            &quot;{testimonial.quote}&quot;
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isIPad && (
              <div className="flex justify-center gap-x-2 pt-2">
                {scrollSnaps.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`group before:border-ring/50 relative flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-transparent p-0 before:absolute before:inset-0 before:rounded-full before:border`}
                  >
                    <span
                      className={`block h-2 w-2 rounded-full transition-colors duration-300 ${index === selectedIndex ? "bg-primary" : ""}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="relative py-16 md:py-20 lg:py-24">
            <div className="relative flex flex-col items-center gap-6">
              <h2 className="text-center text-4xl font-black tracking-tight sm:text-5xl">
                Ready to Modernize Your Networking?
              </h2>
              <div className="flex flex-col justify-center gap-4 font-bold sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started for Free
                    <ArrowRight />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("pricing")}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full border-t px-6 text-xs md:px-8 lg:px-10">
          <div className="py-2 md:py-3 lg:py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setIsFaqOpen(true)}
                >
                  FAQ
                </div>
                <Separator
                  orientation="vertical"
                  className="border-muted-foreground h-4"
                />
                <div
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setIsTermsOpen(true)}
                >
                  Terms
                </div>
                <Separator
                  orientation="vertical"
                  className="border-muted-foreground h-4"
                />
                <div
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setIsPrivacyOpen(true)}
                >
                  Privacy
                </div>
              </div>
              <div className="text-muted-foreground flex flex-col-reverse items-center gap-1 min-[31.25rem]:flex-row">
                <span>
                  &copy; {new Date().getFullYear()} Visiq. All rights reserved.
                </span>
                <Separator
                  orientation="vertical"
                  className="border-muted-foreground ml-3 hidden h-6 min-[31.25rem]:block"
                />
                <div className="flex items-center gap-1">
                  <Button variant="ghost" asChild>
                    <Link
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SimpleIconComponent icon={siFacebook} />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SimpleIconComponent icon={siInstagram} />
                      <span className="sr-only">Instagram</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link
                      href="https://x.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SimpleIconComponent icon={siX} />
                      <span className="sr-only">X</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link
                      href="https://www.linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-linkedin-icon lucide-linkedin"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <FAQDialog open={isFaqOpen} setOpen={setIsFaqOpen} />
      <TermsOfServiceDialog open={isTermsOpen} setOpen={setIsTermsOpen} />
      <PrivacyPolicyDialog open={isPrivacyOpen} setOpen={setIsPrivacyOpen} />
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        shouldScaleBackground
        setBackgroundColorOnScale={false}
      >
        <DrawerContent>
          <VisuallyHidden>
            <DrawerTitle>Navigate</DrawerTitle>
          </VisuallyHidden>

          <div className="space-y-4 px-4 py-2">
            <Button
              variant="ghost"
              onClick={() => handleMenuClick("how-it-works")}
              className="w-full text-base"
            >
              How It Works
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleMenuClick("features")}
              className="w-full text-base"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleMenuClick("pricing")}
              className="w-full text-base"
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleMenuClick("testimonials")}
              className="w-full text-base"
            >
              Testimonials
            </Button>
            <Button
              variant="ghost"
              className="w-full text-base sm:hidden"
              onClick={() => setIsDrawerOpen(false)}
              asChild
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full text-base sm:hidden"
              onClick={() => setIsDrawerOpen(false)}
              asChild
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
