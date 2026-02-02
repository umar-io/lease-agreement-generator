import { v2 as cloudinaryV2 } from "cloudinary";

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinary = {
  isCloudinaryUrl(url: string) {
    return url.includes("cloudinary.com");
  },
  getSignedUrl(publicUrl: string) {
    try {
      const urlObj = new URL(publicUrl);
      const parts = urlObj.pathname.split("/");

      // Example: /<cloud>/raw/upload/v123/folder/file.pdf
      const resourceTypeIdx = parts.findIndex((p) =>
        ["raw", "image", "video"].includes(p),
      );
      if (resourceTypeIdx === -1) return null;

      const resourceType = parts[resourceTypeIdx];
      const type = parts[resourceTypeIdx + 1]; // upload, private, authenticated

      // Find version index if exists
      const versionIdx = parts.findIndex(
        (p) => p.startsWith("v") && !isNaN(Number(p.slice(1))),
      );

      // Extract public_id
      const publicIdParts =
        versionIdx !== -1
          ? parts.slice(versionIdx + 1)
          : parts.slice(resourceTypeIdx + 2);

      const publicId = decodeURIComponent(publicIdParts.join("/"));

      return cloudinaryV2.url(publicId, {
        resource_type: resourceType,
        type: type,
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 600, // 10 minutes
      });
    } catch (e) {
      console.error("Error signing Cloudinary URL:", e);
      return null;
    }
  },
};

export async function uploadPdfToCloudinary(
  pdfBuffer: Buffer,
  fileName: string,
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "leases",
        public_id: fileName,
        format: "pdf",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      },
    );

    uploadStream.end(pdfBuffer);
  });
}

export async function deletePdfFromCloudinary(publicId: string): Promise<void> {
  await cloudinaryV2.uploader.destroy(publicId, { resource_type: "raw" });
}
