"use client";

import { useState } from "react";
import {
  Download,
  Eye,
  MousePointerClick,
  Phone,
  Mail,
  Globe,
  BarChart3,
} from "lucide-react";
import * as RechartsPrimitive from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// Mock data for analytics
const viewsData = [
  { date: "2024-04-01", views: 42 },
  { date: "2024-04-02", views: 38 },
  { date: "2024-04-03", views: 45 },
  { date: "2024-04-04", views: 39 },
  { date: "2024-04-05", views: 47 },
  { date: "2024-04-06", views: 30 },
  { date: "2024-04-07", views: 25 },
  { date: "2024-04-08", views: 55 },
  { date: "2024-04-09", views: 60 },
  { date: "2024-04-10", views: 58 },
  { date: "2024-04-11", views: 65 },
  { date: "2024-04-12", views: 70 },
  { date: "2024-04-13", views: 68 },
  { date: "2024-04-14", views: 72 },
];

const clicksData = [
  { date: "2024-04-01", clicks: 12 },
  { date: "2024-04-02", clicks: 15 },
  { date: "2024-04-03", clicks: 18 },
  { date: "2024-04-04", clicks: 14 },
  { date: "2024-04-05", clicks: 20 },
  { date: "2024-04-06", clicks: 10 },
  { date: "2024-04-07", clicks: 8 },
  { date: "2024-04-08", clicks: 22 },
  { date: "2024-04-09", clicks: 25 },
  { date: "2024-04-10", clicks: 23 },
  { date: "2024-04-11", clicks: 28 },
  { date: "2024-04-12", clicks: 30 },
  { date: "2024-04-13", clicks: 27 },
  { date: "2024-04-14", clicks: 32 },
];

const contactMethodsData = [
  { method: "Phone", count: 45 },
  { method: "Email", count: 78 },
  { method: "Website", count: 32 },
  { method: "Social", count: 65 },
];

const topCardsData = [
  { name: "Professional Card", views: 245, clicks: 98 },
  { name: "Creative Portfolio", views: 187, clicks: 76 },
  { name: "Conference Speaker", views: 156, clicks: 62 },
  { name: "Networking Event", views: 92, clicks: 41 },
];

const visitorLocationsData = [
  { country: "United States", count: 156 },
  { country: "United Kingdom", count: 89 },
  { country: "Canada", count: 72 },
  { country: "Australia", count: 54 },
  { country: "Germany", count: 48 },
  { country: "France", count: 42 },
  { country: "India", count: 38 },
  { country: "Japan", count: 29 },
  { country: "Brazil", count: 25 },
  { country: "Other", count: 67 },
];

export function Analytics() {
  const [dateRange, setDateRange] = useState("last14days");
  const [selectedCard, setSelectedCard] = useState("all");

  // Format date for display
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  }

  // Calculate total views and clicks
  const totalViews = viewsData.reduce((sum, item) => sum + item.views, 0);
  const totalClicks = clicksData.reduce((sum, item) => sum + item.clicks, 0);
  const clickThroughRate = Math.round((totalClicks / totalViews) * 100);

  // Calculate percentage changes (mock data)
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
          <p className="text-muted-foreground">
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
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last14days">Last 14 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:inline-flex md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Views & Clicks</CardTitle>
              <CardDescription>
                Track how many people view and interact with your cards.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                className="h-full"
                config={{
                  views: {
                    label: "Views",
                    color: "hsl(var(--chart-1))",
                  },
                  clicks: {
                    label: "Clicks",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <RechartsPrimitive.ComposedChart
                  data={viewsData.map((item, index) => ({
                    date: formatDate(item.date),
                    views: item.views,
                    clicks: clicksData[index]?.clicks || 0,
                  }))}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                  <RechartsPrimitive.XAxis dataKey="date" />
                  <RechartsPrimitive.YAxis yAxisId="left" />
                  <RechartsPrimitive.YAxis
                    yAxisId="right"
                    orientation="right"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <RechartsPrimitive.Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    activeDot={{ r: 8 }}
                  />
                  <RechartsPrimitive.Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="clicks"
                    stroke="var(--color-clicks)"
                  />
                </RechartsPrimitive.ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6 pt-4">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
              <CardDescription>
                Track how users interact with your cards over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                className="h-full"
                config={{
                  views: {
                    label: "Views",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <RechartsPrimitive.AreaChart
                  data={viewsData.map((item) => ({
                    date: formatDate(item.date),
                    views: item.views,
                  }))}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                  <RechartsPrimitive.XAxis dataKey="date" />
                  <RechartsPrimitive.YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Area
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    fill="var(--color-views)"
                    fillOpacity={0.3}
                  />
                </RechartsPrimitive.AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Phone Clicks
                </CardTitle>
                <Phone className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-green-500">
                  +12.5% from previous period
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Email Clicks
                </CardTitle>
                <Mail className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78</div>
                <p className="text-xs text-green-500">
                  +24.8% from previous period
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Website Visits
                </CardTitle>
                <Globe className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-red-500">
                  -5.2% from previous period
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6 pt-4">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Visitor Locations</CardTitle>
              <CardDescription>
                See where your card viewers are located.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitorLocationsData.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      <p className="text-sm font-medium">{location.country}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-muted h-2 w-32 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full"
                          style={{
                            width: `${(location.count / visitorLocationsData[0].count) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="w-12 text-right text-sm font-medium">
                        {location.count}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
