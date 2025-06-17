import {
  QrCode,
  TabletSmartphone,
  Zap,
  FileChartLine,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="flex min-h-screen flex-col items-center justify-center py-16 md:py-20 lg:py-24"
    >
      <div className="flex w-full flex-col gap-6 px-4 md:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Everything You Need in a Digital Business Card
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
          Visiq provides all the tools you need to create, share, and manage
          your digital presence professionally.
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
  );
}
