import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateStoresWorkflow } from "@medusajs/medusa/core-flows";
import { siteContentSchema, SiteContent } from "../../../utils/site-content";

async function getStore(query) {
  const { data } = await query.graph({
    entity: "store",
    fields: ["id", "metadata"],
  });
  return data[0];
}

/** GET /admin/site-content — current section content (null = defaults in use). */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const store = await getStore(query);
  res.json({
    content: store?.metadata?.site_content ?? null,
    storefrontOrigin: process.env.STOREFRONT_ORIGIN ?? "http://localhost:3000",
  });
}

/** POST /admin/site-content — replace the section content (admin only). */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const content: SiteContent = siteContentSchema.parse(req.body);

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const store = await getStore(query);
  if (!store) {
    return res.status(404).json({ message: "Store not found" });
  }

  await updateStoresWorkflow(req.scope).run({
    input: {
      selector: { id: store.id },
      update: {
        metadata: {
          ...(store.metadata ?? {}),
          site_content: content,
        },
      },
    },
  });

  res.json({ content });
}
