"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import { Loading } from "@/components/loading";

export type ImageTransform = {
  scale: number;
  positionX: number;
  positionY: number;
  croppedAreaPixels?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  naturalWidth?: number;
  naturalHeight?: number;
  croppedImageUrl?: string | null;
};

interface ImageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageType?: "logo" | "profile" | "cover";
  imageUrl: string | null;
  initialTransform?: ImageTransform;
  onSave: (transform: ImageTransform, imageType?: string) => void;
  onDelete: (imageType?: string) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<string>((resolve) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(URL.createObjectURL(file));
      } else {
        resolve("");
      }
    }, "image/jpeg");
  });
}

export function ImageEditorDialog({
  open,
  onOpenChange,
  imageType,
  imageUrl,
  initialTransform,
  onSave,
  onDelete,
}: ImageEditorProps) {
  const [crop, setCrop] = useState({
    x: initialTransform?.positionX || 0,
    y: initialTransform?.positionY || 0,
  });
  const [zoom, setZoom] = useState(initialTransform?.scale || 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(initialTransform?.croppedAreaPixels || null);
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(
    initialTransform?.naturalWidth && initialTransform?.naturalHeight
      ? {
          width: initialTransform.naturalWidth,
          height: initialTransform.naturalHeight,
        }
      : null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open && initialTransform) {
      setCrop({ x: initialTransform.positionX, y: initialTransform.positionY });
      setZoom(initialTransform.scale);
      setCroppedAreaPixels(initialTransform.croppedAreaPixels || null);
    } else if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [open, initialTransform, imageUrl]);

  const getAspectRatio = () => {
    if (imageType === "cover") {
      return 2 / 1;
    } else if (imageType === "logo" || imageType === "profile") {
      return 1;
    }
    return 1;
  };

  useEffect(() => {
    if (imageUrl && open) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setNaturalSize({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = imageUrl;
    }
  }, [imageUrl, open]);

  interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const saveImage = async () => {
    if (!imageType || !croppedAreaPixels || !naturalSize || !imageUrl) return;

    setIsProcessing(true);

    try {
      const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);

      onSave(
        {
          scale: zoom,
          positionX: crop.x,
          positionY: crop.y,
          croppedAreaPixels: croppedAreaPixels,
          naturalWidth: naturalSize.width,
          naturalHeight: naturalSize.height,
          croppedImageUrl: croppedImageUrl || undefined,
        },
        imageType,
      );
    } catch (error) {
      console.error("Error generating cropped image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteImage = () => {
    if (!imageType) return;
    onDelete(imageType);
  };

  const getCropShape = () => {
    if (imageType === "profile") {
      return "round";
    }
    return "rect";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {imageType
              ? `Edit ${imageType.charAt(0).toUpperCase() + imageType.slice(1)} Image`
              : "Edit Image"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-64 w-full overflow-hidden rounded-md border">
            {imageUrl && (
              <div className="relative h-full w-full">
                <Cropper
                  image={imageUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={getAspectRatio()}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape={getCropShape()}
                  showGrid={true}
                  objectFit="contain"
                />
              </div>
            )}
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Zoom</Label>
                <span className="w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <Slider
                value={[zoom * 100]}
                min={100}
                max={300}
                step={5}
                onValueChange={(value) => setZoom(value[0] / 100)}
              />
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={deleteImage}>
                Delete
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={saveImage} disabled={isProcessing}>
                  {isProcessing ? <Loading /> : "Apply"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
