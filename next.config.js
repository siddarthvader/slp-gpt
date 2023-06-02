/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        };

        return config;
    },
    staticPageGenerationTimeout: 1000 * 60 * 5,
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
