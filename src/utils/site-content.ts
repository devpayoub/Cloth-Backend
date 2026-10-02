import { z } from "zod";

/**
 * Site section content stored in `store.metadata.site_content` and editable
 * from the Medusa Admin ("Site Content" page). The storefront merges this
 * over its own static defaults, so partial content is always safe.
 */

export const bannerSchema = z.object({
  image: z.string().min(1),
  alt: z.string().default(""),
  pretitle: z.string().default(""),
  title: z.string().min(1),
  buttonLabel: z.string().min(1),
  href: z.string().min(1),
});

export const siteContentSchema = z.object({
  hero: z.object({
    image: z.string().min(1),
    title: z.string().min(1),
    alt: z.string().default(""),
  }),
  banners: z.array(bannerSchema).min(1),
  catalog: z.object({
    eyebrow: z.string().default(""),
    title: z.string().min(1),
    description: z.string().default(""),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

/** Mirrors the storefront's frontend/content/site.ts defaults. */
export const defaultSiteContent: SiteContent = {
  hero: {
    image: "/HOME.png",
    title: "Cloth",
    alt: "Cloth — FW2026 collection",
  },
  banners: [
    {
      image: "/banner-womens.webp",
      alt: "Women's exclusive FW2026 looks",
      pretitle: "FW2026",
      title: "Women's Exclusive",
      buttonLabel: "Shop Now",
      href: "/collections/womens-new-arrivals",
    },
    {
      image: "/banner-man.webp",
      alt: "Men's exclusive FW2026 looks",
      pretitle: "FW2026",
      title: "Men's Exclusive",
      buttonLabel: "Shop Now",
      href: "/collections/mens-new-arrivals",
    },
    {
      image: "/banner-man2.webp",
      alt: "New arrivals FW2026",
      pretitle: "FW2026",
      title: "New Arrivals",
      buttonLabel: "Shop Now",
      href: "/collections/new-arrivals",
    },
  ],
  catalog: {
    eyebrow: "FW2026 Collection",
    title: "Catalog",
    description: "Every piece from the current season, cut in limited runs.",
  },
};
