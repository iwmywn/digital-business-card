"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ExternalLink,
  QrCode,
  Sparkles,
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
import { FAQSection } from "@/components/faq";
import { subscriptionPlans } from "@/constants";
import type { SerializableLinkType } from "@/components/icons";
import * as constants from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CardDesignValues } from "@/components/card-design";
import { Label } from "@/components/ui/label";
import { SimpleIconComponent } from "@/components/icons";
import { siFacebook, siInstagram, siX } from "simple-icons";
import { PersonalInfoValues } from "@/components/personal-info";

const mockCardDesign: CardDesignValues = {
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
    "v1747620890/digital-business-card/cover/ue2mwjeicfandqa2hxag.jpg",
  ],
  brandName: "iwmywn",
};

const mockPersonalInfo: PersonalInfoValues = {
  fullName: "Hoàng Anh Tuấn",
  jobTitle: "Software Engineer",
  department: "Research & Development",
  company: "NextTech Solutions",
  accreditations: "MBA, CPA",
  headline: "Software Engineer with 1+ year of experience.",
  bio: "Software engineer with skills in full-stack development, cloud computing, and system design.",
};

const mockLinks: SerializableLinkType[] = [
  {
    id: "1",
    type: "GitHub",
    value: "https://github.com/iwmywn",
    category: "Business",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Marketing Director",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1974",
    quote:
      "EZNECT has completely transformed how I network at events. No more fumbling for paper cards or running out. I just share my QR code and track who actually views my information.",
  },
  {
    name: "Michael Chen",
    title: "Startup Founder",
    image:
      "https://images.unsplash.com/photo-1557977275-d261356f567f?q=80&w=1998",
    quote:
      "As a founder, I'm always networking. EZNECT has saved me time and money while making my company look more professional. The analytics feature is a game-changer for follow-ups.",
  },
  {
    name: "Priya Patel",
    title: "Sales Executive",
    image:
      "https://images.unsplash.com/photo-1526510747491-58f928ec870f?q=80&w=1974",
    quote:
      "My entire sales team uses EZNECT now. We've seen a 40% increase in follow-up conversions since we can track who engages with our cards and when to time our outreach perfectly.",
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
      "I've tried several digital card solutions, but EZNECT offers the best balance of features and simplicity. The QR code scanning works flawlessly every time.",
  },
  {
    name: "Jennifer Lee",
    title: "Event Coordinator",
    image:
      "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=1826",
    quote:
      "For someone who attends and organizes networking events, EZNECT has been invaluable. I can quickly share my details with dozens of people without any hassle.",
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
      "In healthcare, being able to quickly share my credentials and contact information with patients is crucial. EZNECT makes this process seamless and professional.",
  },
  {
    name: "James Wilson",
    title: "Photographer",
    image:
      "https://images.unsplash.com/photo-1652278860435-67030231c138?q=80&w=1976",
    quote:
      "As a visual professional, I love how EZNECT lets me showcase my portfolio directly from my digital card. It's like carrying my gallery in my pocket.",
  },
  {
    name: "Olivia Brown",
    title: "HR Manager",
    image:
      "https://images.unsplash.com/photo-1575439462433-8e1969065df7?q=80&w=1974",
    quote:
      "Our entire HR department uses EZNECT for recruiting events. It's made our follow-up process much more efficient and improved our candidate experience.",
  },
  {
    name: "Daniel Kim",
    title: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1698510047345-ff32de8a3b74?q=80&w=1992",
    quote:
      "The technical implementation of EZNECT is impressive. As a developer, I appreciate the attention to detail and the seamless user experience they've created.",
  },
];

export function LandingPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [cardColor, setCardColor] = useState<string>(mockCardDesign.cardColor);
  const [fontFamily, setFontFamily] = useState<string>(
    mockCardDesign.fontFamily,
  );
  const isIPad = useMediaQuery("(max-width: 1024px)");

  const autoScrollOptions = {
    speed: 0.5,
    startDelay: 0,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: isIPad ? "center" : "start" },
    isIPad ? [] : [AutoScroll(autoScrollOptions)],
  );

  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  mockCardDesign.cardColor = cardColor;
  mockCardDesign.fontFamily = fontFamily;

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "features", ref: featuresRef },
        { id: "pricing", ref: pricingRef },
        { id: "testimonials", ref: testimonialsRef },
        { id: "faq", ref: faqRef },
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 60,
        behavior: "smooth",
      });
    }
  };

  const selectedFont =
    constants.allFontOptions.find((font) => font.value === fontFamily) ||
    constants.allFontOptions[0];

  return (
    <div className="min-h-screen">
      <header className="bg-background/75 sticky top-0 z-49 flex shrink-0 items-center justify-between border-b backdrop-blur">
        <div className="flex h-16 w-full items-center justify-between px-6 md:px-8 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-extrabold"
          >
            <Image
              src="/images/logo.png"
              alt="EZNECT"
              width={24}
              height={24}
              className="rounded-lg"
            />
            <span>EZNECT</span>
          </Link>
          <nav className="hidden gap-8 md:flex">
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
            <button
              onClick={() => scrollToSection("faq")}
              className={`text-sm font-medium transition-colors ${activeSection === "faq" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              FAQ
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="w-full px-6 md:px-8 lg:px-10">
        <section className="relative py-16 md:py-20 lg:py-24">
          <div className="flex flex-col gap-6">
            <div className="mb-6 text-center text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <h1>Connect Instantly</h1>
              <h1>with Digital Business Cards</h1>
            </div>
            <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
              Share your contact information with a simple scan. Create
              customizable digital business cards that make networking
              effortless and leave a lasting impression.
            </p>
            <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  Create Your Card
                  <ArrowRight />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => scrollToSection("features")}
              >
                Learn More
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
              <div className="w-full lg:sticky lg:top-16 lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Customize Your Card
                    </CardTitle>
                    <CardDescription>
                      Choose from a variety of fonts and colors to personalize
                      your digital business card.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base">Font Family</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger
                          className={`${selectedFont.className} w-full`}
                        >
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                          {constants.allFontOptions.map((font) => (
                            <SelectItem
                              key={font.value}
                              value={font.value}
                              className={font.className}
                            >
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base">Card Color</Label>
                      <div className="flex flex-wrap gap-3">
                        {constants.allColorOptions.map((color) => (
                          <button
                            key={color.value}
                            className={`h-12 w-12 cursor-pointer rounded-md shadow-sm transition-all ${color.color} ${cardColor === color.value ? "ring-primary scale-110 ring-1 ring-offset-1" : "hover:ring-primary hover:ring-1 hover:ring-offset-1"} `}
                            onClick={() => setCardColor(color.value)}
                            title={color.label}
                            type="button"
                            aria-label={`Select ${color.label} color`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/signup" className="w-full">
                      <Button className="w-full">Create Your Own Card</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>

              <div className="w-full">
                <CardPreview
                  cardDesign={mockCardDesign}
                  personalInfo={mockPersonalInfo}
                  links={mockLinks}
                  size="small"
                />
              </div>
            </div>

            <Button asChild>
              <Link
                href={`${process.env.NEXT_PUBLIC_URL}/card/iwmywn`}
                target="_blank"
                className="sm:mx-auto sm:w-fit"
              >
                See Full Demo
                <ExternalLink />
              </Link>
            </Button>
          </div>
        </section>

        <section
          id="features"
          ref={featuresRef}
          className="bg-card rounded-[5rem] py-16 md:py-20 lg:py-24"
        >
          <div className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need in a Digital Business Card
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
              EZNECT provides all the tools you need to create, share, and
              manage your digital presence professionally.
            </p>
            <div className="[&>div]:hover:ring-primary mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 [&>div]:hover:ring-1 [&>div]:hover:ring-offset-1">
              <Card>
                <CardHeader>
                  <QrCode className="text-primary mb-2 h-10 w-10" />
                  <CardTitle>Instant Sharing</CardTitle>
                  <CardDescription>
                    Share your contact information instantly with a QR code that
                    can be scanned by any smartphone.
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
                    Choose from multiple templates and customize colors, fonts,
                    and layouts to match your brand.
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
            <div className="mt-6 flex flex-wrap justify-center gap-6">
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={
                    "hover:ring-primary relative max-w-sm min-w-[17.5rem] flex-1 overflow-hidden shadow-sm transition-all duration-200 hover:ring-1 hover:ring-offset-1"
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
                    <Link href="/signup" className="w-full">
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.id === "free" ? "Get Started" : "Upgrade"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          ref={testimonialsRef}
          className="bg-card overflow-hidden rounded-[5rem] py-16 md:py-20 lg:py-24"
        >
          <div className="relative flex flex-col items-center gap-6 [&>h2,p]:mx-4 md:[&>h2,p]:mx-6 lg:[&>h2,p]:mx-8">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
              Join thousands of professionals who are already using EZNECT to
              enhance their networking.
            </p>

            <div className="from-background pointer-events-none absolute -top-17 -bottom-17 left-0 z-10 hidden w-20 bg-gradient-to-r to-transparent md:-top-21 md:-bottom-21 lg:-top-25 lg:-bottom-25 lg:block" />
            <div className="from-background pointer-events-none absolute -top-17 right-0 -bottom-17 z-10 hidden w-20 bg-gradient-to-l to-transparent md:-top-21 md:-bottom-21 lg:-top-25 lg:-bottom-25 lg:block" />
            <div className="relative mx-auto mt-6 w-full">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex py-1">
                  {testimonials.map((testimonial, index) => (
                    <Card
                      key={index}
                      className="hover:ring-primary mr-4 h-full min-w-fit transition-all hover:ring-1 hover:ring-offset-1"
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
        </section>

        <section
          id="faq"
          ref={faqRef}
          className="relative py-16 md:py-20 lg:py-24"
        >
          <div className="flex flex-col gap-6">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
              Find answers to common questions about our digital business card
              service.
            </p>
            <div className="mx-auto mt-6 w-full max-w-5xl space-y-6">
              <FAQSection />
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background overflow-hidden rounded-[5rem] py-16 md:py-20 lg:py-24">
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-center text-4xl font-black tracking-tight sm:text-5xl">
              Ready to Modernize Your Networking?
            </h2>
            <div className="flex flex-col justify-center gap-4 font-bold sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Get Started for Free
                  <ArrowRight />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="bg-foreground hover:bg-accent-foreground hover:text-accent dark:bg-muted-foreground/10 dark:border-muted-foreground dark:hover:bg-muted-foreground/20"
                onClick={() => scrollToSection("pricing")}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-16 w-full border-t px-6 md:mt-20 md:px-8 lg:mt-24 lg:px-10">
        <div className="py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-extrabold"
              >
                <Image
                  src="/images/logo.png"
                  alt="EZNECT"
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
                <span>EZNECT</span>
              </Link>
              <div>
                <Button variant="ghost" asChild>
                  <Link href="#" className="text-muted-foreground">
                    <SimpleIconComponent icon={siFacebook} />
                    <span className="sr-only">Facebook</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="#" className="text-muted-foreground">
                    <SimpleIconComponent icon={siInstagram} />
                    <span className="sr-only">Instagram</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="#" className="text-muted-foreground">
                    <SimpleIconComponent icon={siX} />
                    <span className="sr-only">X</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="#" className="text-muted-foreground">
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
              <p className="text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} EZNECT. All rights reserved.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-medium">Product</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Testimonials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-medium">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-medium">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
