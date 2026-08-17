// Base URL of the backend server (not the /api prefix) - used to resolve
// uploaded image paths like "/uploads/xyz.jpg" into full URLs.
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export const resolveImageUrl = (image) => {
  if (!image) return "https://placehold.co/400x300?text=No+Image";
  if (image.startsWith("http")) return image;
  return `${SERVER_URL}${image}`;
};
