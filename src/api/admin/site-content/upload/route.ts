import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";

/**
 * POST /admin/site-content/upload — multipart image upload.
 * Files: <input name="files" type="file">. Returns the public URLs.
 * The default local file provider stores files in backend/static/ and
 * serves them at <backend url>/static/<filename>.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const files = (req.files ?? []) as Express.Multer.File[];
    if (files.length === 0) {
      return res.status(400).json({ message: "No files received" });
    }

    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: files.map((file) => ({
          filename: file.originalname,
          mimeType: file.mimetype,
          content: file.buffer.toString("base64"),
          access: "public",
        })),
      },
    });

    res.json({ files: result });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Upload failed", error: String(error) });
  }
}
