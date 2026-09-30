import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows";
import { seedCategories, seedProducts } from "./seed-data";

/**
 * Seeds the Cloth storefront catalog (idempotent — safe to re-run):
 *   - USD region (United States)
 *   - "Storefront" sales channel + publishable API key
 *   - product categories (men / women / accessories / footwear)
 *   - catalog products with Size x Color variants
 *
 * Run with:  pnpm seed   (inside backend/)
 * The publishable key is printed at the end — copy it into the storefront's
 * NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY.
 */
export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // 1) Region (USD) — reuse if it exists
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  });
  let region = existingRegions.find((r) => r.currency_code === "usd");
  if (!region) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [{ name: "United States", currency_code: "usd", countries: ["us"] }],
      },
    });
    const created = result[0];
    if (!created) throw new Error("Failed to create region");
    region = created;
    logger.info(`Region created: ${region.name} (${region.currency_code})`);
  } else {
    logger.info(`Region reused: ${region.name} (${region.currency_code})`);
  }

  // 2) Publishable API key — reuse the first one if it exists
  const { data: existingKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "type"],
  });
  let publishableKey: { id: string; token: string } | undefined =
    existingKeys.find((k) => k.type === "publishable");
  if (!publishableKey) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({ input: { salesChannelsData: [{ name: "Storefront" }] } });
    const salesChannel = salesChannelResult[0];

    const { result: apiKeyResult } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Storefront", type: "publishable", created_by: "" }],
      },
    });
    publishableKey = apiKeyResult[0];
    if (!publishableKey) throw new Error("Failed to create publishable key");

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: publishableKey.id, add: [salesChannel.id] },
    });
    logger.info("Publishable key created and linked to the Storefront channel");
  } else {
    logger.info("Publishable key reused");
  }

  // 3) Categories — create only the missing handles
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  });
  const existingHandles = new Set(existingCategories.map((c) => c.handle));
  const missingCategories = seedCategories.filter(
    (category) => !existingHandles.has(category.handle)
  );
  if (missingCategories.length > 0) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((category) => ({
          ...category,
          is_active: true,
          is_internal: false,
        })),
      },
    });
    logger.info(`Categories created: ${result.length}`);
  } else {
    logger.info("Categories already present");
  }
  const { data: allCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  });
  const categoryIdByHandle = new Map(
    allCategories.map((category) => [category.handle, category.id])
  );

  // 4) Products — skip ones that already exist (by handle)
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });
  const existingSlugs = new Set(existingProducts.map((p) => p.handle));
  const newProducts = seedProducts.filter(
    (product) => !existingSlugs.has(product.slug)
  );

  if (newProducts.length > 0) {
    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: newProducts.map((product) => ({
          title: product.name,
          handle: product.slug,
          description: product.description,
          status: "published" as const,
          category_ids: [categoryIdByHandle.get(product.category)].filter(
            (id): id is string => Boolean(id)
          ),
          images: product.images.map((url) => ({ url })),
          options: [
            {
              title: "Size",
              values: [...new Set(product.variants.map((v) => v.size))],
            },
            { title: "Color", values: product.colors.map((c) => c.name) },
          ],
          variants: product.variants.flatMap((variant) =>
            product.colors.map((color) => ({
              title: `${variant.size} / ${color.name}`,
              options: {
                Size: variant.size,
                Color: color.name,
              },
              // Demo catalog: stock is not tracked, so every variant is
              // purchasable. Enable inventory management + stock locations
              // when real stock counts are needed.
              manage_inventory: false,
              prices: [
                {
                  amount: variant.price,
                  currency_code: "usd",
                },
              ],
            }))
          ),
          metadata: {
            rating: product.rating,
            reviewCount: product.reviewCount,
            isFeatured: product.isFeatured,
            colors: JSON.stringify(product.colors),
            tags: JSON.stringify(product.tags),
          },
        })),
      },
    });
    logger.info(`Products created: ${result.length}`);
  } else {
    logger.info("Products already present");
  }

  // 5) Sanity check
  const { data: storedProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "variants.*"],
  });
  const variantCount = storedProducts.reduce(
    (sum, product) => sum + (product.variants?.length ?? 0),
    0
  );
  logger.info(
    `Seed complete: ${storedProducts.length} products, ${variantCount} variants.`
  );
  logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableKey?.token}`);
}
