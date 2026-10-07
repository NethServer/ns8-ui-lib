const path = require("path");

// Configuration of the playground (npm run playground), a local app to test
// library components. It is not used to build the library, see build/.
module.exports = {
  pages: {
    index: {
      entry: "playground/main.js",
      template: "playground/index.html",
      title: "ns8-ui-lib playground",
    },
  },
  css: {
    loaderOptions: {
      sass: {
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
  configureWebpack: {
    resolve: {
      alias: {
        // import the library like consumers do, resolved to the source code
        "@nethserver/ns8-ui-lib$": path.resolve(__dirname, "src/entry.esm.js"),
      },
    },
    module: {
      rules: [
        // Handle .mjs files from node_modules (e.g. @carbon/icons-vue) as
        // javascript/auto, so webpack 4 uses flexible CJS/ESM interop
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
  },
};
