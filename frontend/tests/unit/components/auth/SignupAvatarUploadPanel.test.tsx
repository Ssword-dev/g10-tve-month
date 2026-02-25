import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignupAvatarUploadPanel } from "@/components/features/auth/SignupAvatarUploadPanel";

describe("SignupAvatarUploadPanel", () => {
  it("renders empty state when there is no preview image", () => {
    render(<SignupAvatarUploadPanel previewUrl={null} onFileChange={vi.fn()} />);

    expect(screen.getByText("Profile Photo")).toBeInTheDocument();
    expect(screen.getByText("Add avatar")).toBeInTheDocument();
    expect(screen.queryByAltText("Avatar preview")).not.toBeInTheDocument();
  });

  it("renders image preview when previewUrl is provided", () => {
    render(
      <SignupAvatarUploadPanel
        previewUrl="blob:test-avatar"
        onFileChange={vi.fn()}
      />,
    );

    const preview = screen.getByAltText("Avatar preview");
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute("src", "blob:test-avatar");
  });

  it("invokes onFileChange when a file is selected", () => {
    const onFileChange = vi.fn();
    const { container } = render(
      <SignupAvatarUploadPanel previewUrl={null} onFileChange={onFileChange} />,
    );

    const input = container.querySelector(
      "input#avatar[type='file']",
    ) as HTMLInputElement | null;
    expect(input).not.toBeNull();

    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    fireEvent.change(input!, { target: { files: [file] } });

    expect(onFileChange).toHaveBeenCalledTimes(1);
  });
});
