import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Medhu's Quest",
    short_name: "Medhu's Quest",
    description: "Maths quests with Mooshak, gods and superheroes",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8ec",
    theme_color: "#f28c28",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
