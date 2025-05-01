"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Trash2, Grip, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Mail,
  Phone,
  Globe,
  Link2,
  MapPin,
  Twitter,
  Instagram,
  CircleDashed,
  Linkedin,
  Facebook,
  Youtube,
  SnailIcon as Snapchat,
  TwitterIcon as TikTok,
  Twitch,
  YoutubeIcon as Yelp,
  PhoneIcon as WhatsApp,
  MessageCircle,
  DiscIcon as Discord,
  WebcamIcon as Skype,
  Send,
  Github,
  Calendar,
  ShoppingCartIcon as Paypal,
  DollarSign,
  CreditCard,
} from "lucide-react";

export type LinkType = {
  id: string;
  type: string;
  value: string;
  category: string;
  icon: React.ElementType;
  label?: string;
};

const linkTypes = [
  { type: "Email", icon: Mail, category: "General" },
  { type: "Phone", icon: Phone, category: "General" },
  { type: "Company URL", icon: Globe, category: "General" },
  { type: "Link", icon: Link2, category: "General" },
  { type: "Address", icon: MapPin, category: "General" },

  { type: "X", icon: Twitter, category: "Social" },
  { type: "Instagram", icon: Instagram, category: "Social" },
  { type: "Threads", icon: CircleDashed, category: "Social" },
  { type: "LinkedIn", icon: Linkedin, category: "Social" },
  { type: "Facebook", icon: Facebook, category: "Social" },
  { type: "YouTube", icon: Youtube, category: "Social" },
  { type: "Snapchat", icon: Snapchat, category: "Social" },
  { type: "TikTok", icon: TikTok, category: "Social" },
  { type: "Twitch", icon: Twitch, category: "Social" },
  { type: "Yelp", icon: Yelp, category: "Social" },

  { type: "WhatsApp", icon: WhatsApp, category: "Messaging" },
  { type: "Signal", icon: MessageCircle, category: "Messaging" },
  { type: "Discord", icon: Discord, category: "Messaging" },
  { type: "Skype", icon: Skype, category: "Messaging" },
  { type: "Telegram", icon: Send, category: "Messaging" },

  { type: "GitHub", icon: Github, category: "Business" },
  { type: "Calendly", icon: Calendar, category: "Business" },

  { type: "PayPal", icon: Paypal, category: "Payment" },
  { type: "Venmo", icon: DollarSign, category: "Payment" },
  { type: "CashApp", icon: CreditCard, category: "Payment" },
];

const categories = ["General", "Social", "Messaging", "Business", "Payment"];

function SortableLink({
  link,
  updateLink,
  removeLink,
}: {
  link: LinkType;
  updateLink: (id: string, field: string, value: string) => void;
  removeLink: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const IconComponent = link.icon;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-muted/30 flex items-center gap-2 rounded-md p-2 ${isDragging ? "shadow-lg" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab touch-manipulation"
      >
        <Grip className="text-muted-foreground h-5 w-5" />
      </div>
      <IconComponent className="h-5 w-5 flex-shrink-0" />
      <div className="flex flex-grow flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Custom label (optional)"
          value={link.label || ""}
          onChange={(e) => updateLink(link.id, "label", e.target.value)}
          className="flex-grow sm:w-1/3"
        />
        <Input
          placeholder={`Enter your ${link.type}`}
          value={link.value}
          onChange={(e) => updateLink(link.id, "value", e.target.value)}
          className="flex-grow"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeLink(link.id)}
        className="text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function Links({
  onSave,
  initialLinks = [],
}: {
  onSave: (links: LinkType[]) => void;
  initialLinks?: LinkType[];
}) {
  const [links, setLinks] = useState<LinkType[]>(initialLinks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const hasChanged = JSON.stringify(links) !== JSON.stringify(initialLinks);

    if (hasChanged) {
      onSave(links);
    }
  }, [links, onSave, initialLinks]);

  const addLink = (type: string, category: string, icon: React.ElementType) => {
    const newLink = {
      id: Date.now().toString(),
      type,
      value: "",
      category,
      icon,
      label: "",
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, field: string, value: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, [field]: value } : link,
      ),
    );
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {links.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Links</h3>
            <p className="text-muted-foreground text-sm">
              Drag to reorder how links appear on your card
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={links.map((link) => link.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {links.map((link) => (
                    <SortableLink
                      key={link.id}
                      link={link}
                      updateLink={updateLink}
                      removeLink={removeLink}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <Separator />
          </div>
        )}

        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h3 className="text-sm font-medium">{category}</h3>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {linkTypes
                .filter((linkType) => linkType.category === category)
                .map((linkType) => {
                  const IconComponent = linkType.icon;

                  return (
                    <Button
                      key={linkType.type}
                      variant="outline"
                      size="sm"
                      className="flex h-20 flex-col items-center justify-center gap-1 p-2 transition-all hover:border-gray-300 hover:bg-gray-50"
                      onClick={() =>
                        addLink(linkType.type, linkType.category, linkType.icon)
                      }
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="text-center text-xs">
                        {linkType.type}
                      </span>
                      <Plus className="absolute right-1 bottom-1 h-3 w-3" />
                    </Button>
                  );
                })}
            </div>

            <Separator />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
