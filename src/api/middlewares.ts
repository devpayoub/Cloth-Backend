import multer from "multer";
import { defineMiddlewares } from "@medusajs/framework/http";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/site-content/upload",
      methods: ["POST"],
      middlewares: [multer({ storage: multer.memoryStorage() }).array("files")],
    },
  ],
});
