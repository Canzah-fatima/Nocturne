import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.100.171",
    "localhost:3000",
    "192.168.100.171:3000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.asos-media.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "gbghxfniyilowljadkrg.supabase.co",
      },
      {
        protocol: "https",
        hostname: "d3t32hsnjxo7q6.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "www.dior.com",
      },
      {
        protocol: "http",
        hostname: "makeup-api.herokuapp.com",
      },
      {
        protocol: "https",
        hostname: "www.nyxcosmetics.com",
      },
      {
        protocol: "https",
        hostname: "www.maybelline.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;