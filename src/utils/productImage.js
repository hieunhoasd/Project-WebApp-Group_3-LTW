export function getProductImageUrl(image) {
  if (!image) return "/src/assets/images/banner.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const storageUrl = import.meta.env.VITE_STORAGE_URL || "";
  const normalizedPath = image.startsWith("assets/")
    ? image
    : `assets/products/${image}`;

  return `${storageUrl}${normalizedPath}`;
}
