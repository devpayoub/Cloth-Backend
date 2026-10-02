import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * GET /store/site-content — public, read-only section content for the
 * storefront. `content` is null when the admin has not customized it yet;
 * the storefront then falls back to its own defaults.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "store",
    fields: ["metadata"],
  });
  res.json({ content: data[0]?.metadata?.site_content ?? null });
}
