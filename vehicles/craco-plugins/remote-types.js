const WebpackRemoteTypesPlugin = require("webpack-remote-types-plugin").default;
const federation = require("../federation.config.json");

module.exports = {
  overrideWebpackConfig: ({ webpackConfig }) => {
    webpackConfig.plugins = [
      ...webpackConfig.plugins,
      new WebpackRemoteTypesPlugin({
        remotes: { ...federation.remotes },
        outputDir: "@federated", // supports [name] as the remote name
        remoteFileName: "[name]-dts.tgz", // default filename is [name]-dts.tgz where [name] is the remote name, for example, `app` with the above setup
      }),
    ];

    return webpackConfig;
  },
};
