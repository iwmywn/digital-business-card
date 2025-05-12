"use client";

import { Eye, MousePointerClick, ChartColumnIncreasing } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { Card as CardType } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { useCard, useUser } from "@/lib/hooks";
import { AnalyticsSkeleton } from "@/components/skeletons";
import { toast } from "sonner";
import { NotFoundUI } from "@/components/not-found-ui";

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-1)",
  },
  clicks: {
    label: "Clicks",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function Analytics() {
  const [dateRange, setDateRange] = useState<string>("7days");
  const [selectedCard, setSelectedCard] = useState<string>("all");
  const [analyticsData, setAnalyticsData] = useState<
    {
      date: string;
      views: number;
      clicks: number;
    }[]
  >([]);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [clickThroughRate, setClickThroughRate] = useState<number>(0);
  const [viewsChange, setViewsChange] = useState<number>(0);
  const [clicksChange, setClicksChange] = useState<number>(0);
  const [ctrChange, setCtrChange] = useState<number>(0);
  const { currentPlan, isUserLoading, isUserError } = useUser();
  const { cards, isCardLoading, isCardError } = useCard();

  useEffect(() => {
    if (cards.length === 0) return;

    const filteredCards =
      selectedCard === "all"
        ? cards
        : cards.filter((card) => card._id === selectedCard);

    let views = 0;
    let clicks = 0;

    filteredCards.forEach((card) => {
      views += card.views || 0;
      clicks += card.clicks || 0;
    });

    setTotalViews(views);
    setTotalClicks(clicks);
    setClickThroughRate(views > 0 ? Math.round((clicks / views) * 100) : 0);

    setViewsChange(18.5);
    setClicksChange(24.2);
    setCtrChange(4.8);

    if (currentPlan === "professional") {
      generateChartData(filteredCards, dateRange);
    }
  }, [cards, dateRange, selectedCard, currentPlan]);

  const generateChartData = (cards: CardType[], range: string) => {
    if (cards.length === 0) {
      setAnalyticsData([]);
      return;
    }

    const now = new Date();
    const startDate = new Date();

    if (range === "24hours") {
      startDate.setDate(now.getDate() - 1);
    } else if (range === "7days") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "30days") {
      startDate.setDate(now.getDate() - 30);
    } else {
      startDate.setDate(now.getDate() - 90);
    }

    const dateRange: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= now) {
      dateRange.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const data = dateRange.map((date) => ({
      date,
      views: 0,
      clicks: 0,
    }));

    cards.forEach((card) => {
      (card.viewHistory || []).forEach(
        (view: { date: Date; count: number }) => {
          const viewDate = new Date(view.date).toISOString().split("T")[0];
          if (dateRange.includes(viewDate)) {
            const dataPoint = data.find((d) => d.date === viewDate);
            if (dataPoint) {
              dataPoint.views += view.count || 1;
            }
          }
        },
      );

      (card.clickHistory || []).forEach(
        (click: { date: Date; count: number }) => {
          const clickDate = new Date(click.date).toISOString().split("T")[0];
          if (dateRange.includes(clickDate)) {
            const dataPoint = data.find((d) => d.date === clickDate);
            if (dataPoint) {
              dataPoint.clicks += click.count || 1;
            }
          }
        },
      );
    });

    setAnalyticsData(data);
  };

  useEffect(() => {
    if (isUserError) toast.error(isUserError);
    if (
      isCardError &&
      !isCardError.includes("You've reached the maximum number of cards")
    )
      toast.error(isCardError);
  }, [isUserError, isCardError]);

  if (isUserLoading || isCardLoading) {
    return <AnalyticsSkeleton />;
  }

  if (currentPlan === "free") {
    return (
      <NotFoundUI
        icon={<ChartColumnIncreasing />}
        title="UNLOCK ANALYTICS"
        message="Upgrade to our Basic or Professional plan to access analytics for your
          digital business cards."
        linkHref="/subscription"
        linkLabel="Go to subscription"
        className="min-h-[calc(100vh-4.83rem)]"
      />
    );
  }

  if (cards.length === 0) {
    return (
      <NotFoundUI
        icon={<ChartColumnIncreasing />}
        title="NO CARDS YET"
        message="Create a digital business card to start tracking your analytics."
        linkHref="/create"
        linkLabel="Create your first card"
        className="min-h-[calc(100vh-4.83rem)]"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground text-sm">
            Track the performance of your digital business cards
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={selectedCard} onValueChange={setSelectedCard}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select card" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cards</SelectItem>
              {cards.map((card) => (
                <SelectItem key={card._id} value={card._id}>
                  {card.personalInfo.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">Last 24 hours</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="alltime">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p
              className={cn(
                "text-xs",
                viewsChange > 0 ? "text-green-500" : "text-red-500",
              )}
            >
              {viewsChange > 0 ? "+" : ""}
              {viewsChange}% from previous period
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p
              className={cn(
                "text-xs",
                clicksChange > 0 ? "text-green-500" : "text-red-500",
              )}
            >
              {clicksChange > 0 ? "+" : ""}
              {clicksChange}% from previous period
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Click-Through Rate
            </CardTitle>
            <ChartColumnIncreasing className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickThroughRate}%</div>
            <p
              className={cn(
                "text-xs",
                ctrChange > 0 ? "text-green-500" : "text-red-500",
              )}
            >
              {ctrChange > 0 ? "+" : ""}
              {ctrChange}% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {currentPlan !== "free" && (
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Card Performance</CardTitle>
            <CardDescription>
              Showing views and clicks for the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentPlan === "basic" ? (
              <NotFoundUI
                icon={<ChartColumnIncreasing />}
                title="UNLOCK ANALYTICS"
                message="Upgrade to our professional plan to access detailed analytics
                  for your digital business cards."
                linkHref="/subscription"
                linkLabel="Go to subscription"
                className="h-[250px]"
              />
            ) : (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-views)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-views)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-clicks)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-clicks)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="clicks"
                    type="natural"
                    fill="url(#fillClicks)"
                    stroke="var(--color-clicks)"
                    stackId="a"
                  />
                  <Area
                    dataKey="views"
                    type="natural"
                    fill="url(#fillViews)"
                    stroke="var(--color-views)"
                    stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
