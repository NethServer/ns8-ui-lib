export default {
  name: "UtilService",
  data() {
    return {
      DELETE_DELAY: 7000, // you have 7 seconds to cancel object deletion
    };
  },
  methods: {
    getErrorMessage(error) {
      if (error.message === "Network Error") {
        return this.$t("error.network_error");
      }

      if (/^timeout of .+ exceeded$/.test(error.message)) {
        // axios timeout reached
        return this.$t("error.network_timeout");
      }

      if (error.response) {
        switch (error.response.status) {
          case 401:
            return this.$t("error.401");
          case 403:
            return this.$t("error.403");
          case 404:
            return this.$t("error.404");
        }
      }

      return this.$t("error.generic_error");
    },
    clearErrors(context) {
      for (const key of Object.keys(context.error)) {
        context.error[key] = "";
      }
    },
    /**
     * Sort function to order array elements by a specific property (for array of objects) or by a specific index (for arrays of arrays)
     *
     */
    sortByProperty(property) {
      return function (a, b) {
        if (a[property] < b[property]) {
          return -1;
        }
        if (a[property] > b[property]) {
          return 1;
        }
        return 0;
      };
    },
    /**
     * Sort function for module instances (e.g. ["dokuwiki1", "dokuwiki2", "dokuwiki11"])
     *
     */
    sortModuleInstances() {
      return function (instance1, instance2) {
        const instance1Name = instance1.id.split(/[0-9]+/)[0];
        const instance1Number = parseInt(
          instance1.id.substring(instance1Name.length)
        );

        const instance2Name = instance2.id.split(/[0-9]+/)[0];
        const instance2Number = parseInt(
          instance2.id.substring(instance2Name.length)
        );

        // compare instance names
        if (instance1Name < instance2Name) {
          return -1;
        } else if (instance1Name > instance2Name) {
          return 1;
        } else {
          // compare instance numbers
          if (instance1Number < instance2Number) {
            return -1;
          } else if (instance1Number > instance2Number) {
            return 1;
          } else {
            return 0;
          }
        }
      };
    },
    /**
     * Return if input string can be parsed as a JSON object
     *
     */
    isJson(s) {
      try {
        JSON.parse(s);
        return true;
      } catch (err) {
        return false;
      }
    },
    /**
     * Try to parse input string and return a JSON object. If input string cannot be parsed, then input string is returned
     *
     */
    tryParseJson(s) {
      try {
        return JSON.parse(s);
      } catch (err) {
        return s;
      }
    },
    /**
     * Set focus on an HTML element
     */
    focusElement(elementRef) {
      this.$nextTick(() => {
        const element = this.$refs[elementRef];
        element.focus();
      });
    },
    /**
     * Get app description using the locale of NS8 core context
     */
    getAppDescription(app, coreContext) {
      const langCode = coreContext.$root.$i18n.locale;
      let description = app.description[langCode];

      if (!description) {
        // fallback to english
        description = app.description.en;
      }
      return description;
    },
    /**
     * Get app categories using the locale of NS8 core context
     */
    getAppCategories(app, coreContext) {
      let i18nCategories = [];

      for (const category of app.categories) {
        if (category === "unknown") {
          return "";
        }

        i18nCategories.push(
          coreContext.$t("software_center.app_categories." + category)
        );
      }
      return i18nCategories.join(", ");
    },
  },
};
