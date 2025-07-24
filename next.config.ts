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
    i18n: {
        locales: ['en', 'ar'],
        defaultLocale: 'ar',
    }
};

export default nextConfig;
