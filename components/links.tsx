"use client";

import { useState, useEffect } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  linkTypes,
  categories,
  type LinkType,
  type SerializableLinkType,
  toSerializableLink,
} from "@/components/icons";
import { toLinkType } from "@/components/icons";
import * as constants from "@/constants";
import { useUser } from "@/lib/swr";
import { toast } from "sonner";

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
        <GripVertical className="text-muted-foreground h-5 w-5" />
      </div>
      <IconComponent className="h-5 w-5 flex-shrink-0" />
      <div className="flex flex-grow flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Custom label (optional)"
          value={link.label || ""}
          onChange={(e) => updateLink(link.id, "label", e.target.value)}
          className="flex-grow sm:w-1/2"
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

const maxLinksByPlan: Record<string, number> = {
  free: constants.maxFreeLinks,
  basic: constants.maxBasicLinks,
  professional: constants.maxProfessionalLinks,
};

export function Links({
  onSave,
  initialLinks = [],
}: {
  onSave: (links: SerializableLinkType[]) => void;
  initialLinks?: SerializableLinkType[];
}) {
  const [links, setLinks] = useState<LinkType[]>(() => {
    return initialLinks.map((link) => toLinkType(link));
  });
  const { user } = useUser();
  const currentPlan = user?.currentPlan || "free";
  const maxLinks = maxLinksByPlan[currentPlan];

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
    const serializableLinks = links.map(toSerializableLink);
    onSave(serializableLinks);
  }, [links, onSave]);

  const addLink = (type: string, category: string, icon: React.ElementType) => {
    if (links.length >= maxLinks) {
      toast.warning(`Your current plan allows up to ${maxLinks} links.`);
      return;
    }

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
            <h3 className="text-base font-medium">{category}</h3>

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
                      <IconComponent />
                      <span className="text-center text-xs">
                        {linkType.type}
                      </span>
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
