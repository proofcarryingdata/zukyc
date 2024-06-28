/** @type {import('next').NextConfig} */

module.exports = {
  transpilePackages: ["@repo/ui"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false
      };
      config.resolve.alias = {
        constants: require.resolve(
          "rollup-plugin-node-polyfills/polyfills/constants"
        ),
        process: "process/browser"
      };
    }

    return config;
  }
};
