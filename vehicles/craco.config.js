module.exports = {
  plugins: [
    {
      plugin: require("./craco-plugins/module-federation"),
    },
    {
      plugin: require("./craco-plugins/remote-types"),
    },
  ],
};
