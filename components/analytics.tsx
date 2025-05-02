"use client";

import * as React from "react";
import { Eye, MousePointerClick, BarChart3 } from "lucide-react";
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

const chartData = [
  { date: "2024-04-01", views: 42, clicks: 12 },
  { date: "2024-04-02", views: 38, clicks: 15 },
  { date: "2024-04-03", views: 45, clicks: 18 },
  { date: "2024-04-04", views: 39, clicks: 14 },
  { date: "2024-04-05", views: 47, clicks: 20 },
  { date: "2024-04-06", views: 30, clicks: 10 },
  { date: "2024-04-07", views: 25, clicks: 8 },
  { date: "2024-04-08", views: 55, clicks: 22 },
  { date: "2024-04-09", views: 60, clicks: 25 },
  { date: "2024-04-10", views: 58, clicks: 23 },
  { date: "2024-04-11", views: 65, clicks: 28 },
  { date: "2024-04-12", views: 70, clicks: 30 },
  { date: "2024-04-13", views: 68, clicks: 27 },
  { date: "2024-04-14", views: 72, clicks: 32 },
  { date: "2024-04-15", views: 75, clicks: 35 },
  { date: "2024-04-16", views: 80, clicks: 38 },
  { date: "2024-04-17", views: 82, clicks: 40 },
  { date: "2024-04-18", views: 85, clicks: 42 },
  { date: "2024-04-19", views: 88, clicks: 45 },
  { date: "2024-04-20", views: 90, clicks: 48 },
  { date: "2024-04-21", views: 92, clicks: 50 },
  { date: "2024-04-22", views: 95, clicks: 52 },
  { date: "2024-04-23", views: 98, clicks: 55 },
  { date: "2024-04-24", views: 100, clicks: 58 },
  { date: "2024-04-25", views: 105, clicks: 60 },
  { date: "2024-04-26", views: 110, clicks: 62 },
  { date: "2024-04-27", views: 115, clicks: 65 },
  { date: "2024-04-28", views: 120, clicks: 68 },
  { date: "2024-04-29", views: 125, clicks: 70 },
  { date: "2024-04-30", views: 130, clicks: 72 },
  { date: "2024-05-01", views: 145, clicks: 90 },
  { date: "2024-05-02", views: 167, clicks: 113 },
];

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
  const [dateRange, setDateRange] = React.useState("7days");
  const [selectedCard, setSelectedCard] = React.useState("all");

  const filteredData = React.useMemo(() => {
    if (dateRange === "alltime") {
      return chartData;
    }

    const lastDataDate = chartData[chartData.length - 1].date;
    const referenceDate = new Date(lastDataDate);

    let daysToSubtract = 30;
    if (dateRange === "24hours") daysToSubtract = 1;
    else if (dateRange === "7days") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    const startDateStr = startDate.toISOString().split("T")[0];

    return chartData.filter((item) => item.date >= startDateStr);
  }, [dateRange]);

  const totalViews = filteredData.reduce((sum, item) => sum + item.views, 0);
  const totalClicks = filteredData.reduce((sum, item) => sum + item.clicks, 0);
  const clickThroughRate =
    totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

  const viewsChange = 18.5;
  const clicksChange = 24.2;
  const ctrChange = 4.8;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground text-sm">
            Track the performance of your digital business cards.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={selectedCard} onValueChange={setSelectedCard}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select card" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cards</SelectItem>
              <SelectItem value="professional">Professional Card</SelectItem>
              <SelectItem value="creative">Creative Portfolio</SelectItem>
              <SelectItem value="networking">Networking Event</SelectItem>
              <SelectItem value="speaker">Conference Speaker</SelectItem>
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
            <div className="text-2xl font-bold">
              {totalViews.toLocaleString()}
            </div>
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
            <div className="text-2xl font-bold">
              {totalClicks.toLocaleString()}
            </div>
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
            <BarChart3 className="text-muted-foreground h-4 w-4" />
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

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Card Performance</CardTitle>
          <CardDescription>
            Showing views and clicks for the selected time period
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
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
        </CardContent>
      </Card>
    </div>
  );
}
