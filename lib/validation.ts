export const validateImageFile = (file: File): string | null => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!validTypes.includes(file.type)) {
    return "Only JPG, JPEG, PNG, and WEBP files are allowed.";
  }
  if (file.size > maxSize) {
    return "File size must be under 2MB.";
  }
  return null;
};
