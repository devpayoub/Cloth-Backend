import { defineRouteConfig } from "@medusajs/admin-sdk";
import { PencilSquare } from "@medusajs/icons";
import { Button, Container, Heading, Input, Label, Text } from "@medusajs/ui";
import { useEffect, useState } from "react";

type Banner = {
  image: string;
  alt: string;
  pretitle: string;
  title: string;
  buttonLabel: string;
  href: string;
};

type SiteContent = {
  hero: { image: string; title: string; alt: string };
  banners: Banner[];
  catalog: { eyebrow: string; title: string; description: string };
};

const FALLBACK: SiteContent = {
  hero: { image: "", title: "Cloth", alt: "" },
  banners: [
    { image: "", alt: "", pretitle: "FW2026", title: "Women's Exclusive", buttonLabel: "Shop Now", href: "/collections/womens-new-arrivals" },
    { image: "", alt: "", pretitle: "FW2026", title: "Men's Exclusive", buttonLabel: "Shop Now", href: "/collections/mens-new-arrivals" },
    { image: "", alt: "", pretitle: "FW2026", title: "New Arrivals", buttonLabel: "Shop Now", href: "/collections/new-arrivals" },
  ],
  catalog: { eyebrow: "FW2026 Collection", title: "Catalog", description: "" },
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: init?.body ? { "content-type": "application/json" } : undefined,
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("files", file);
  const res = await fetch("/admin/site-content/upload", {
    method: "POST",
    credentials: "include",
    body,
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Upload failed (${res.status}): ${errText}`);
  }
  const json = (await res.json()) as { files: { url: string }[] };
  return json.files[0].url;
}

const SiteContentPage = () => {
  const [content, setContent] = useState<SiteContent>(FALLBACK);
  const [origin, setOrigin] = useState("http://localhost:3000");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api<{
          content: SiteContent | null;
          storefrontOrigin: string;
        }>("/admin/site-content");
        setOrigin(data.storefrontOrigin);
        if (data.content) setContent(data.content);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function update(patch: Partial<SiteContent>) {
    setContent((prev) => ({ ...prev, ...patch }));
  }

  function updateBanner(index: number, patch: Partial<Banner>) {
    setContent((prev) => ({
      ...prev,
      banners: prev.banners.map((banner, i) =>
        i === index ? { ...banner, ...patch } : banner
      ),
    }));
  }

  async function handleUpload(field: string, file: File | undefined) {
    if (!file) return;
    setUploading(field);
    setError(null);
    try {
      const url = await uploadImage(file);
      setContent((prev) => {
        const next = structuredClone(prev);
        const parts = field.split(".");
        if (parts[0] === "hero") next.hero.image = url;
        if (parts[0] === "banner") {
          const idx = Number(parts[1]);
          next.banners[idx].image = url;
        }
        return next;
      });
    } catch (err) {
      setError(String(err));
    } finally {
      setUploading(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await api("/admin/site-content", {
        method: "POST",
        body: JSON.stringify(content),
      });
      setMessage("Saved. The storefront shows the change within a minute.");
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  const previewSrc = (url: string) =>
    url.startsWith("http") ? url : `${origin}${url}`;

  function ImageField({
    label,
    value,
    uploading,
    onFile,
    onUrlChange,
  }: {
    label: string;
    value: string;
    uploading: boolean;
    onFile: (file: File) => void;
    onUrlChange: (url: string) => void;
  }) {
    return (
      <div>
        <Label>{label}</Label>
        <div className="mt-1 flex items-center gap-3">
          {value ? (
            <img
              src={previewSrc(value)}
              alt={label}
              className="h-16 w-14 rounded-md border border-ui-border-base object-cover"
            />
          ) : (
            <div className="flex h-16 w-14 items-center justify-center rounded-md border border-ui-border-base text-xs text-ui-fg-subtle">
              None
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            disabled={uploading}
            className="text-xs"
          />
          {uploading && <Text size="xsmall">Uploading…</Text>}
        </div>
        <Input
          value={value}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="…or paste an image URL"
          className="mt-2"
        />
      </div>
    );
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Site Content</Heading>
          <Text className="text-ui-fg-subtle">
            Homepage sections — changes go live on the storefront within a
            minute.
          </Text>
        </div>
        <Button variant="primary" onClick={handleSave} disabled={saving || loading}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {message && (
        <div className="px-6 pb-2">
          <Text size="small" className="text-ui-fg-base">{message}</Text>
        </div>
      )}
      {error && (
        <div className="px-6 pb-2">
          <Text size="small" className="text-ui-fg-error">{error}</Text>
        </div>
      )}

      <div className="px-6 pb-6">
        {/* Hero */}
        <Container className="mb-4 p-4">
          <Heading level="h2">Hero section</Heading>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <ImageField
              label="Background image"
              value={content.hero.image}
              uploading={uploading === "hero"}
              onFile={(file) => handleUpload("hero", file)}
              onUrlChange={(url) => update({ hero: { ...content.hero, image: url } })}
            />
            <div className="flex flex-col gap-3">
              <div>
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => update({ hero: { ...content.hero, title: e.target.value } })}
                />
              </div>
              <div>
                <Label>Alt text</Label>
                <Input
                  value={content.hero.alt}
                  onChange={(e) => update({ hero: { ...content.hero, alt: e.target.value } })}
                />
              </div>
            </div>
          </div>
        </Container>

        {/* Banners */}
        {content.banners.map((banner, index) => (
          <Container className="mb-4 p-4" key={index}>
            <Heading level="h2">Banner {index + 1}</Heading>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <ImageField
                label="Banner image"
                value={banner.image}
                uploading={uploading === `banner.${index}`}
                onFile={(file) => handleUpload(`banner.${index}`, file)}
                onUrlChange={(url) => updateBanner(index, { image: url })}
              />
              <div className="flex flex-col gap-3">
                <div>
                  <Label>Pretitle</Label>
                  <Input
                    value={banner.pretitle}
                    onChange={(e) => updateBanner(index, { pretitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={banner.title}
                    onChange={(e) => updateBanner(index, { title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Button label</Label>
                    <Input
                      value={banner.buttonLabel}
                      onChange={(e) => updateBanner(index, { buttonLabel: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Button link</Label>
                    <Input
                      value={banner.href}
                      onChange={(e) => updateBanner(index, { href: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        ))}

        {/* Catalog section header */}
        <Container className="mb-4 p-4">
          <Heading level="h2">Catalog section header</Heading>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <Label>Eyebrow</Label>
              <Input
                value={content.catalog.eyebrow}
                onChange={(e) => update({ catalog: { ...content.catalog, eyebrow: e.target.value } })}
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={content.catalog.title}
                onChange={(e) => update({ catalog: { ...content.catalog, title: e.target.value } })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={content.catalog.description}
                onChange={(e) => update({ catalog: { ...content.catalog, description: e.target.value } })}
              />
            </div>
          </div>
        </Container>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Site Content",
  icon: PencilSquare,
});

export default SiteContentPage;
