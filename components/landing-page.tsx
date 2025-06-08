"use client";

import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ExternalLink,
  QrCode,
  TabletSmartphone,
  Zap,
  FileChartLine,
  LayoutDashboard,
  Shield,
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
import { CardDesign, type CardDesignValues } from "@/components/card-design";
import { Label } from "@/components/ui/label";
import { LinkedInIcon, SimpleIconComponent } from "@/components/icons";
import { siFacebook, siInstagram, siX } from "simple-icons";
import {
  PersonalInformation,
  type PersonalInformationValues,
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
import { LandingPageThemeToggle } from "@/components/mode-toggle";

const visiqSocialLinks = [
  {
    href: "https://www.facebook.com",
    label: "Facebook",
    icon: <SimpleIconComponent icon={siFacebook} />,
  },
  {
    href: "https://www.instagram.com",
    label: "Instagram",
    icon: <SimpleIconComponent icon={siInstagram} />,
  },
  {
    href: "https://x.com",
    label: "X",
    icon: <SimpleIconComponent icon={siX} />,
  },
  {
    href: "https://www.linkedin.com",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
];

const featureItems = [
  {
    icon: QrCode,
    title: "Instant Sharing",
    description:
      "Share your contact information instantly with a QR code that can be scanned by any smartphone.",
  },
  {
    icon: TabletSmartphone,
    title: "Mobile Optimized",
    description:
      "Deliver a flawless experience on any device with a design that adapts to all screen sizes.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Update your information anytime and it's instantly reflected on your digital card.",
  },
  {
    icon: FileChartLine,
    title: "Analytics & Insights",
    description:
      "Track who views and clicks your card and gain valuable insights about your networking efforts.",
  },
  {
    icon: LayoutDashboard,
    title: "Customizable Design",
    description:
      "Customize colors, fonts, and more to reflect your personal or business brand.",
  },
  {
    icon: Shield,
    title: "Privacy Controls",
    description:
      "Control who sees your information with advanced privacy settings and permissions.",
  },
];

const testimonialItems = [
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
};

const demoPersonalInformation: PersonalInformationValues = {
  fullName: "Hoàng Anh Tuấn",
  jobTitle: "Software Engineer",
  department: "Research & Development",
  company: "NextTech Solutions",
  accreditations: "MBA, CPA",
  headline: "Software Engineer with 1+ year of experience.",
  bio: "Software Engineer with skills in full-stack development, cloud computing, and system design.",
};

const demoLinks: SerializableLinkType[] = [
  {
    id: "1",
    type: "GitHub",
    value: "https://github.com/iwmywn",
    category: "Business",
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
  const menuItems = useMemo(
    () => [
      { id: "how-it-works", label: "How It Works", ref: howItWorksRef },
      { id: "features", label: "Features", ref: featuresRef },
      { id: "pricing", label: "Pricing", ref: pricingRef },
      { id: "testimonials", label: "Testimonials", ref: testimonialsRef },
    ],
    [],
  );
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
  const [cardDesign, setCardDesign] =
    useState<CardDesignValues>(demoCardDesign);
  const [personalInfo, setPersonalInfo] = useState<PersonalInformationValues>(
    demoPersonalInformation,
  );
  const [links, setLinks] = useState<SerializableLinkType[]>(demoLinks);
  const handleCardDesignUpdate = useCallback((values: CardDesignValues) => {
    setCardDesign(values);
  }, []);
  const handlePersonalInfoUpdate = useCallback(
    (values: PersonalInformationValues) => {
      setPersonalInfo(values);
    },
    [],
  );
  const handleLinksUpdate = useCallback((values: SerializableLinkType[]) => {
    setLinks(values);
  }, []);

  const filteredTestimonials = isIPad
    ? testimonialItems.slice(0, 6)
    : testimonialItems;

  const scrollToSection = (elementRef: RefObject<HTMLElement | null>) => {
    if (elementRef.current) {
      elementRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

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
        let activeFound = false;

        for (const item of menuItems) {
          const el = item.ref.current;

          if (el) {
            const rect = el.getBoundingClientRect();
            const intersectionHeight = Math.max(
              0,
              Math.min(rect.bottom, window.innerHeight) - Math.max(0, rect.top),
            );
            const visiblePercentage =
              (intersectionHeight / el.offsetHeight) * 100;

            if (visiblePercentage >= 20) {
              setActiveSection(item.id);
              activeFound = true;
              break;
            }
          }
        }

        if (!activeFound) {
          setActiveSection(null);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems]);

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
              {menuItems.map(({ id, label, ref }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(ref)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
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
        <main className="w-full px-6 md:px-8 lg:px-10">
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
                onClick={() => scrollToSection(howItWorksRef)}
              >
                Learn More
              </Button>
            </div>
          </section>

          <section
            ref={howItWorksRef}
            className="relative flex min-h-screen flex-col items-center justify-center py-16 md:py-20 lg:py-24"
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
            ref={featuresRef}
            className="bg-secondary dark:bg-card flex min-h-screen flex-col items-center justify-center py-16 [clip-path:polygon(0%_5%,5%_0%,95%_0%,100%_5%,100%_95%,95%_100%,5%_100%,0%_95%)] md:py-20 lg:py-24"
          >
            <div className="flex w-full flex-col gap-6 px-4 md:px-6 lg:px-8">
              <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need in a Digital Business Card
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
                Visiq provides all the tools you need to create, share, and
                manage your digital presence professionally.
              </p>
              <div className="[&>div]:hover:ring-primary mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 [&>div]:hover:ring-1 [&>div]:hover:ring-offset-1">
                {featureItems.map(({ icon: Icon, title, description }) => (
                  <Card key={title}>
                    <CardHeader>
                      <Icon className="text-primary mb-2 size-10" />
                      <CardTitle>{title}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section
            ref={pricingRef}
            className="relative flex min-h-screen flex-col items-center justify-center py-16 md:py-20 lg:py-24"
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
                          <Sparkles className="size-3" />
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
                            <Check className="text-primary mt-0.5 mr-2 size-4 flex-shrink-0" />
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
            key={filteredTestimonials.length}
            ref={testimonialsRef}
            className="bg-secondary dark:bg-card relative flex min-h-screen flex-col items-center justify-center overflow-hidden rounded-[5rem] py-16 md:py-20 lg:py-24"
          >
            <div className="from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 hidden w-20 bg-gradient-to-r to-transparent lg:block" />
            <div className="from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 hidden w-20 bg-gradient-to-l to-transparent lg:block" />
            <div className="flex flex-col items-center gap-6 [&>h2,p]:mx-4 md:[&>h2,p]:mx-6 lg:[&>h2,p]:mx-8">
              <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
                Join thousands of professionals who are already using Visiq to
                enhance their networking.
              </p>

              <div className="embla">
                <div className="embla__viewport" ref={emblaRef}>
                  <div className="embla__container">
                    {filteredTestimonials.map((testimonial, index) => (
                      <Card
                        key={index}
                        className={`hover:ring-primary embla__slide hover:ring-1 hover:ring-offset-1 ${isIPad ? "cursor-pointer" : ""}`}
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
                    className={`group before:border-ring/50 relative flex size-4 cursor-pointer items-center justify-center rounded-full bg-transparent p-0 before:absolute before:inset-0 before:rounded-full before:border`}
                  >
                    <span
                      className={`block size-2 rounded-full transition-colors duration-300 ${index === selectedIndex ? "bg-primary" : ""}`}
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
                  onClick={() => scrollToSection(pricingRef)}
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
              <div className="text-muted-foreground flex flex-col-reverse items-center gap-1 min-[33.75rem]:flex-row">
                <span>
                  &copy; {new Date().getFullYear()} Visiq. All rights reserved.
                </span>
                <Separator
                  orientation="vertical"
                  className="border-muted-foreground ml-3 hidden h-6 min-[33.75rem]:block"
                />
                <div className="flex items-center gap-1">
                  {visiqSocialLinks.map(({ href, label, icon }) => (
                    <Button key={label} variant="ghost" asChild>
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {icon}
                        <span className="sr-only">{label}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
                <Separator
                  orientation="vertical"
                  className="border-muted-foreground mr-3 hidden h-6 min-[33.75rem]:block"
                />
                <div className="flex items-center rounded-sm border">
                  <LandingPageThemeToggle />
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
            {menuItems.map(({ id, label, ref }) => (
              <Button
                key={id}
                variant="ghost"
                onClick={() => {
                  setIsDrawerOpen(false);
                  scrollToSection(ref);
                }}
                className="w-full text-base"
              >
                {label}
              </Button>
            ))}
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
