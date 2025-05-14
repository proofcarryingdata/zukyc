/** @type {import('next').NextConfig} */
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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

      // Deploys GPC artifacts into a public dir where they can be downloaded
      // by browsers.
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: "../../node_modules/@pcd/proto-pod-gpc-artifacts",
              to: path.resolve(__dirname, "public", "artifacts")
            }
          ]
        })
      );
    }

    return config;
  },
  async headers() {
    return [
      // Makes the GPC artifacts directory downloadable, including by pages
      // running on a different origin URL.  This is specifically to allow the
      // verifier to also download the same artifacts.  The "Origin" of *
      // allows htis, but could be narrower if desired for security.
      {
        source: "/artifacts/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT"
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          }
        ]
      }
    ];
  }
};
