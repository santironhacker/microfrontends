const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "mfe-resources",

  exposes: {
    "./Learn": "./projects/mfe-resources/src/app/learn/learn.component.ts",
    "./About": "./projects/mfe-resources/src/app/about/about.component.ts",
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },
});
