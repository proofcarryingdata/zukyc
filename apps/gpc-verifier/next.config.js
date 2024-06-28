/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // required for fastfile
      // fastfile uses node modules "fs", "constants",
      // and global "process" (process.browser)
      // see details here: https://github.com/proofcarryingdata/zukyc/pull/3
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
