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
        locales: ['ar'],
        defaultLocale: 'ar',
    }
};

export default nextConfig;
