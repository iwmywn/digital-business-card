"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import type { EmblaCarouselType } from "embla-carousel"
import AutoScroll from "embla-carousel-auto-scroll"
import useEmblaCarousel from "embla-carousel-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/use-media-query"

const testimonialItems = [
  {
    name: "Sarah Johnson",
    title: "Marketing Director",
    image:
      "https://images.unsplash.com/photo-1529232356377-57971f020a94?q=80&w=1976",
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
]

export function TestimonialsSection() {
  const isIPad = useMediaQuery("(max-width: 1023px)")
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
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
        ]
  )

  const filteredTestimonials = isIPad
    ? testimonialItems.slice(0, 6)
    : testimonialItems

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect)

    return () => {
      emblaApi
        .off("reInit", onInit)
        .off("reInit", onSelect)
        .off("select", onSelect)
    }
  }, [emblaApi, onInit, onSelect])

  return (
    <section
      key={filteredTestimonials.length}
      id="testimonials"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-16 md:py-20 lg:py-24"
    >
      <div className="bg-[linear-gradient(to_right,theme(colors.background),transparent)] pointer-events-none absolute top-0 bottom-0 left-0 z-10 hidden w-20 lg:block" />
      <div className="bg-[linear-gradient(to_left,theme(colors.background),transparent)] pointer-events-none absolute top-0 right-0 bottom-0 z-10 hidden w-20 lg:block" />
      <div className="flex flex-col items-center gap-6 [&>h2,p]:mx-10 md:[&>h2,p]:mx-12 lg:[&>h2,p]:mx-14">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          What Our Customers Say
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
          Join thousands of professionals who are already using Visiq to enhance
          their networking.
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
                      <div
                        className={`${isIPad ? "size-11" : "size-13"} shrink-0 overflow-hidden rounded-full`}
                      >
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={isIPad ? 44 : 52}
                          height={isIPad ? 44 : 52}
                        />
                      </div>
                      <div>
                        <CardTitle
                          className={`text-primary ${isIPad ? "text-base" : "text-lg"}`}
                        >
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription
                          className={`${isIPad ? "" : "text-base"}`}
                        >
                          {testimonial.title}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent
                    className={`${isIPad ? "text-sm" : "text-base"} text-muted-foreground`}
                  >
                    &quot;{testimonial.quote}&quot;
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
  )
}
