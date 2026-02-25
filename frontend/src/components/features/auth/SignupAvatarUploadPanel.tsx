import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/misc";
import { Camera, Plus } from "lucide-react";
import type { ChangeEvent } from "react";

interface SignupAvatarUploadPanelProps {
  previewUrl: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function SignupAvatarUploadPanel({
  previewUrl,
  onFileChange,
}: SignupAvatarUploadPanelProps) {
  const hasAvatar = previewUrl !== null;

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <Text weight="semibold">Profile Photo</Text>
        <Badge className="rounded-full bg-accent/20">Optional</Badge>
      </div>

      <label
        htmlFor="avatar"
        className="group relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/35"
      >
        {hasAvatar ? (
          <img
            src={previewUrl}
            alt="Avatar preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="rounded-full border border-border bg-card p-3">
              <Camera className="size-5" />
            </div>
            <Text size="sm" className="text-muted-foreground">
              Add avatar
            </Text>
          </div>
        )}

        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${
            hasAvatar ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          <span className="rounded-full bg-card/90 p-3">
            <Plus className="size-6" />
          </span>
        </div>
      </label>

      <Input
        id="avatar"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileChange}
      />

      <Text size="xs" className="mt-3 text-muted-foreground">
        JPEG, PNG, or WEBP. Max size 5MB.
      </Text>
    </section>
  );
}
