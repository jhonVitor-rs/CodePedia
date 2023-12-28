import { writeAsyncIterableToWritable } from "@remix-run/node";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: ENV.CLOUD_NAME,
  api_key: ENV.API_KEY,
  api_secret: ENV.API_SECRET,
});

type CloudinaryUploadResult = UploadApiResponse;

export async function uploadImage(
  data: AsyncIterable<Uint8Array>
): Promise<CloudinaryUploadResult | undefined> {
  return new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "remixImages" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    await writeAsyncIterableToWritable(data, uploadStream);
  });
}

export async function deleteImage(public_id: string) {
  await cloudinary.v2.uploader.destroy(public_id)
}
