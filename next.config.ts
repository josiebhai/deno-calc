import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No route in this app needs server rendering — /c reads its data
  // client-side from Firestore — so we export fully static HTML and deploy
  // to Firebase Hosting without Cloud Functions.
  output: "export",
};

export default nextConfig;
