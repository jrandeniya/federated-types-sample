const webpack = require("webpack");
const paths = require("react-scripts/config/paths");
const deps = require("../package.json").dependencies;
const federation = require("../federation.config.json");

const ModuleFederationConfig = {
  ...federation,
  filename: "remoteEntry.js",
  shared: {
    ...deps,
    react: {
      singleton: true,
      requiredVersion: deps["react"],
    },
    "react-dom": {
      singleton: true,
      requiredVersion: deps["react-dom"],
    },
  },
};

module.exports = {
  overrideWebpackConfig: ({ webpackConfig }) => {
    webpackConfig.output.publicPath = "auto";

    const htmlWebpackPlugin = webpackConfig.plugins.find(
      (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
    );

    htmlWebpackPlugin.userOptions = {
      ...htmlWebpackPlugin.userOptions,
      publicPath: paths.publicUrlOrPath,
      excludeChunks: [ModuleFederationConfig.name],
    };

    webpackConfig.plugins = [
      ...webpackConfig.plugins,
      new webpack.container.ModuleFederationPlugin(ModuleFederationConfig),
    ];
    return webpackConfig;
  },
  overrideDevServerConfig: ({ devServerConfig }) => {
    devServerConfig.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    };

    return devServerConfig;
  },
};
