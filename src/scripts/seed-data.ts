export type SeedVariant = {
  size: string;
  price: number; // in minor units (cents)
};

export type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  variants: SeedVariant[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  createdAt: string;
};

/**
 * Storefront origin serving /clo/* assets. Medusa stores image URLs as-is;
 * the storefront mapper strips the origin back to a local path.
 */
export const STOREFRONT_ORIGIN =
  process.env.STOREFRONT_ORIGIN ?? "http://localhost:3000";

const img = (file: string) => `${STOREFRONT_ORIGIN}/clo/${file}`;

export const seedCategories = [
  { name: "Men", handle: "men" },
  { name: "Women", handle: "women" },
  { name: "Accessories", handle: "accessories" },
  { name: "Footwear", handle: "footwear" },
];

export const seedProducts: SeedProduct[] = [
  {
    slug: "boxy-fit-hoodie",
    name: "Boxy Fit Hoodie",
    description: "Relaxed boxy-fit hoodie with dropped shoulders.",
    category: "men",
    tags: ["hoodie", "streetwear"],
    colors: [{ name: "Black", hex: "#111111" }],
    images: [
      img("NP_SORRY_ECOMM63542_aa3e0587-1fe5-4296-8916-b9d0b6e28cb5.webp"),
      img("NP_SORRY_ECOMM66258_d073e620-108f-4137-9cdc-f5e2829e573b.webp"),
    ],
    variants: [
      { size: "S", price: 8900 },
      { size: "M", price: 8900 },
      { size: "L", price: 8900 },
      { size: "XL", price: 8900 },
    ],
    rating: 4.6,
    reviewCount: 42,
    isFeatured: true,
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    slug: "cargo-utility-pants",
    name: "Cargo Utility Pants",
    description:
      "Utility cargo pants with multiple pockets and an adjustable waist.",
    category: "men",
    tags: ["pants", "cargo"],
    colors: [{ name: "Olive", hex: "#5c5c3d" }],
    images: [
      img("NP_SORRY_ECOMM66258_d073e620-108f-4137-9cdc-f5e2829e573b.webp"),
      img("NP_SORRY_ECOMM67698_2.webp"),
    ],
    variants: [
      { size: "28", price: 10900 },
      { size: "30", price: 10900 },
      { size: "32", price: 10900 },
      { size: "34", price: 10900 },
      { size: "36", price: 10900 },
    ],
    rating: 4.5,
    reviewCount: 31,
    isFeatured: true,
    createdAt: "2026-01-18T00:00:00.000Z",
  },
  {
    slug: "oversized-shirt-jacket",
    name: "Oversized Shirt Jacket",
    description: "Oversized shirt jacket layered for transitional weather.",
    category: "men",
    tags: ["jacket", "outerwear"],
    colors: [{ name: "Beige", hex: "#c8b89a" }],
    images: [
      img("NP_SORRY_ECOMM67698_2.webp"),
      img("NP_SORRY_ECOMM68321_f67df279-99e4-4fb3-8441-8b48e02907c4.webp"),
    ],
    variants: [
      { size: "S", price: 13900 },
      { size: "M", price: 13900 },
      { size: "L", price: 13900 },
      { size: "XL", price: 13900 },
    ],
    rating: 4.7,
    reviewCount: 24,
    isFeatured: true,
    createdAt: "2026-01-20T00:00:00.000Z",
  },
  {
    slug: "relaxed-denim-jeans",
    name: "Relaxed Denim Jeans",
    description: "Relaxed-fit denim jeans with a straight leg.",
    category: "men",
    tags: ["denim", "jeans"],
    colors: [{ name: "Indigo", hex: "#2e4a6b" }],
    images: [
      img("NP_SORRY_ECOMM70442_62870f2f-a2c9-4f20-9c0a-4b45c4b39292.webp"),
    ],
    variants: [
      { size: "28", price: 9900 },
      { size: "30", price: 9900 },
      { size: "32", price: 9900 },
      { size: "34", price: 9900 },
      { size: "36", price: 9900 },
    ],
    rating: 4.4,
    reviewCount: 19,
    isFeatured: true,
    createdAt: "2026-01-22T00:00:00.000Z",
  },
  {
    slug: "knit-crop-sweater",
    name: "Knit Crop Sweater",
    description: "Soft ribbed knit sweater with a cropped silhouette.",
    category: "women",
    tags: ["knitwear", "sweater"],
    colors: [{ name: "Cream", hex: "#e8e0d0" }],
    images: [
      img("NP_SORRY_ECOMM63542_aa3e0587-1fe5-4296-8916-b9d0b6e28cb5.webp"),
    ],
    variants: [
      { size: "S", price: 7900 },
      { size: "M", price: 7900 },
      { size: "L", price: 7900 },
    ],
    rating: 4.8,
    reviewCount: 36,
    isFeatured: true,
    createdAt: "2026-02-02T00:00:00.000Z",
  },
  {
    slug: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    description: "Flowing pleated midi skirt with an elasticated waist.",
    category: "women",
    tags: ["skirts"],
    colors: [{ name: "Grey", hex: "#9ca3af" }],
    images: [
      img("NP_SORRY_ECOMM68321_f67df279-99e4-4fb3-8441-8b48e02907c4.webp"),
    ],
    variants: [
      { size: "S", price: 8500 },
      { size: "M", price: 8500 },
      { size: "L", price: 8500 },
      { size: "XL", price: 8500 },
    ],
    rating: 4.3,
    reviewCount: 17,
    isFeatured: false,
    createdAt: "2026-02-05T00:00:00.000Z",
  },
  {
    slug: "oversized-wool-coat",
    name: "Oversized Wool Coat",
    description: "Double-faced wool coat with dropped shoulders and belt.",
    category: "women",
    tags: ["outerwear", "coat"],
    colors: [{ name: "Beige", hex: "#c8b89a" }],
    images: [
      img("NP_SORRY_ECOMM67698_2.webp"),
      img("NP_SORRY_ECOMM66258_d073e620-108f-4137-9cdc-f5e2829e573b.webp"),
    ],
    variants: [
      { size: "S", price: 24900 },
      { size: "M", price: 24900 },
      { size: "L", price: 24900 },
    ],
    rating: 4.9,
    reviewCount: 58,
    isFeatured: true,
    createdAt: "2026-02-09T00:00:00.000Z",
  },
  {
    slug: "canvas-tote-bag",
    name: "Canvas Tote Bag",
    description: "Heavy-duty canvas tote with interior zip pocket.",
    category: "accessories",
    tags: ["bags"],
    colors: [{ name: "Natural", hex: "#d9cfc0" }],
    images: [
      img("NP_SORRY_ECOMM66258_d073e620-108f-4137-9cdc-f5e2829e573b.webp"),
    ],
    variants: [{ size: "One Size", price: 4500 }],
    rating: 4.6,
    reviewCount: 64,
    isFeatured: true,
    createdAt: "2026-02-12T00:00:00.000Z",
  },
  {
    slug: "leather-belt",
    name: "Leather Belt",
    description: "Full-grain leather belt with a brushed brass buckle.",
    category: "accessories",
    tags: ["belts", "leather"],
    colors: [{ name: "Brown", hex: "#6b4f3a" }],
    images: [
      img("NP_SORRY_ECOMM70442_62870f2f-a2c9-4f20-9c0a-4b45c4b39292.webp"),
    ],
    variants: [
      { size: "S", price: 5500 },
      { size: "M", price: 5500 },
      { size: "L", price: 5500 },
    ],
    rating: 4.5,
    reviewCount: 22,
    isFeatured: false,
    createdAt: "2026-02-14T00:00:00.000Z",
  },
  {
    slug: "wool-beanie",
    name: "Wool Beanie",
    description: "Ribbed merino wool beanie, lightly cropped fit.",
    category: "accessories",
    tags: ["hats", "winter"],
    colors: [{ name: "Black", hex: "#111111" }],
    images: [
      img("NP_SORRY_ECOMM67698_2.webp"),
    ],
    variants: [{ size: "One Size", price: 3500 }],
    rating: 4.7,
    reviewCount: 41,
    isFeatured: false,
    createdAt: "2026-02-16T00:00:00.000Z",
  },
  {
    slug: "minimal-leather-sneaker",
    name: "Minimal Leather Sneaker",
    description: "Clean leather sneaker with a cupsole and padded footbed.",
    category: "footwear",
    tags: ["sneakers", "leather"],
    colors: [{ name: "White", hex: "#f5f5f5" }],
    images: [
      img("NP_SORRY_ECOMM68321_f67df279-99e4-4fb3-8441-8b48e02907c4.webp"),
    ],
    variants: [
      { size: "40", price: 12900 },
      { size: "41", price: 12900 },
      { size: "42", price: 12900 },
      { size: "43", price: 12900 },
      { size: "44", price: 12900 },
    ],
    rating: 4.6,
    reviewCount: 73,
    isFeatured: true,
    createdAt: "2026-02-18T00:00:00.000Z",
  },
  {
    slug: "suede-chelsea-boot",
    name: "Suede Chelsea Boot",
    description: "Suede chelsea boot with elastic gore and leather lining.",
    category: "footwear",
    tags: ["boots", "suede"],
    colors: [{ name: "Brown", hex: "#6b4f3a" }],
    images: [
      img("NP_SORRY_ECOMM70442_62870f2f-a2c9-4f20-9c0a-4b45c4b39292.webp"),
    ],
    variants: [
      { size: "40", price: 18900 },
      { size: "41", price: 18900 },
      { size: "42", price: 18900 },
      { size: "43", price: 18900 },
    ],
    rating: 4.8,
    reviewCount: 29,
    isFeatured: false,
    createdAt: "2026-02-21T00:00:00.000Z",
  },
];
