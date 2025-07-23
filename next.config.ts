import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
      return [
          {
              source: "/",
              destination: "/invoice",
              permanent: true,
          }
      ]
  },
};

export default nextConfig;
