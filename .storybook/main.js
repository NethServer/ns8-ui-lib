const path = require("path");

module.exports = {
  stories: ["../stories/**/*.stories.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/preset-scss",
      options: {
        sassLoaderOptions: {
          sassOptions: {
            // Carbon v10 SCSS triggers many Dart Sass deprecation warnings
            quietDeps: true,
            silenceDeprecations: [
              "import",
              "global-builtin",
              "color-functions",
              "if-function",
              "slash-div",
              "legacy-js-api",
            ],
          },
        },
      },
    },
  ],
  core: {
    disableTelemetry: true,
  },
  webpackFinal: async (config) => {
    // Stories import the library like consumers do; resolve it to the source
    // code so that unreleased changes are shown
    config.resolve.alias["@nethserver/ns8-ui-lib$"] = path.resolve(
      __dirname,
      "../src/entry.esm.js"
    );
    // alias used inside library source
    config.resolve.alias["@"] = path.resolve(__dirname, "../src");

    // Handle .mjs files from node_modules (e.g. @carbon/icons-vue) as
    // javascript/auto so webpack 4 uses flexible CJS/ESM interop instead of
    // strict ESM, which otherwise breaks named imports from CommonJS deps.
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    // package.json declares "sideEffects": false for consumers of the library:
    // keep global setup and stylesheets, otherwise production builds drop them
    config.module.rules.push({
      test: /([\\/]dev[\\/].*\.js|\.s?css)$/,
      sideEffects: true,
    });
    return config;
  },
};
