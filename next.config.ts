import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    /* config options here */
    output: 'standalone',

    experimental: {
        globalNotFound: true
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('odbc')
        }
        // config.module.rules.push({
        //     test: /\.html$/,
        //     use: 'ignore-loader',
        // })
        // config.resolve.fallback = {
        //     ...config.resolve.fallback,
        //     "mock-aws-s3": false,
        //     "aws-sdk": false,
        //     "nock": false,
        // }
        // console.log("Webpack config:", config);
        return config
    },
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
