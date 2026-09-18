const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function uploadImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No image file selected"));
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(
        new Error("Cloudinary configuration is missing"),
      );
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    );

    // =========================
    // Upload Progress
    // =========================

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const progress = Math.round(
        (event.loaded / event.total) * 100,
      );

      if (onProgress) {
        onProgress(progress);
      }
    });

    // =========================
    // Upload Finished
    // =========================

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);

          if (!data.secure_url) {
            reject(
              new Error(
                "Cloudinary did not return an image URL",
              ),
            );
            return;
          }

          resolve(data.secure_url);
        } catch {
          reject(
            new Error("Invalid response from Cloudinary"),
          );
        }

        return;
      }

      reject(
        new Error(
          `Image upload failed (${xhr.status})`,
        ),
      );
    });

    // =========================
    // Network Error
    // =========================

    xhr.addEventListener("error", () => {
      reject(
        new Error(
          "Network error while uploading image",
        ),
      );
    });

    // =========================
    // Upload Cancelled
    // =========================

    xhr.addEventListener("abort", () => {
      reject(new Error("Image upload was cancelled"));
    });

    xhr.send(formData);
  });
}