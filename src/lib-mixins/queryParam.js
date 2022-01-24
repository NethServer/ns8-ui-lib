export default {
  name: "QueryParamService",
  methods: {
    // used by core and external apps to dynamically register a watch for every object inside data.q
    watchQueryData(context) {
      if (context.q) {
        Object.keys(context.q).forEach((dataItem) => {
          context.$watch("q." + dataItem, function () {
            this.dataToQueryParams(context);
          });
        });
      }
    },
    // used only by external apps to sync UI status with URL query parameters
    initUrlBindingForApp(context, page) {
      let queryParams = this.getQueryParamsForApp();
      const requestedPage = queryParams.page || "status";

      if (requestedPage != page) {
        return;
      }

      this.syncQueryParamsAndDataForApp(context);
      return setInterval(() => this.checkUrlChangeForApp(context, page), 500);
    },
    // used only by external apps to sync UI status with URL query parameters
    syncQueryParamsAndDataForApp(context) {
      this.queryParamsToDataForApp(context);
      this.dataToQueryParams(context);
    },
    // used to sync UI status with URL query parameters
    dataToQueryParams(context) {
      let queryParams = [];

      for (const [key, value] of Object.entries(context.q)) {
        queryParams.push(key + "=" + encodeURIComponent(value));
      }

      const urlWithParams =
        window.parent.core.$route.path + "?" + queryParams.join("&");

      if (window.parent.core.$route.fullPath != urlWithParams) {
        window.parent.core.$router.replace(urlWithParams);
      }
    },
    // used only by external apps to sync UI status with URL query parameters
    checkUrlChangeForApp(context, page) {
      const newUrl = window.parent.location.href;

      if (newUrl != context.currentUrl) {
        context.currentUrl = newUrl;
        const queryParams = this.getQueryParamsForApp();
        const requestedPage = queryParams.page || "status";

        // emit app navigation event
        const appInstance = /#\/apps\/(\w+)/.exec(
          window.parent.location.hash
        )[1];
        context.$root.$emit("appNavigation", appInstance, requestedPage);

        if (requestedPage !== page) {
          // trigger a custom event to change app route
          window.dispatchEvent(
            new CustomEvent("changeRoute", { detail: requestedPage })
          );
        } else {
          this.syncQueryParamsAndDataForApp(context);
        }
      }
      context.currentUrl = window.parent.location.href;
    },
    getPage() {
      let queryParams = this.getQueryParamsForApp();
      const page = queryParams.page || "status";
      return page;
    },
    queryParamsToDataForCore(context, queryParams) {
      if (context.q) {
        Object.keys(context.q).forEach((dataItem) => {
          if (typeof queryParams[dataItem] !== "undefined") {
            context.q[dataItem] = this.getTypedValue(queryParams[dataItem]);
          }
        });
      }
    },
    // used to map a query string parameter value to its typed value
    getTypedValue(stringValue) {
      if (stringValue === "true") {
        return true;
      }

      if (stringValue === "false") {
        return false;
      }

      return stringValue;
    },
    // used only by external apps to sync UI status with URL query parameters
    queryParamsToDataForApp(context) {
      let queryParams = this.getQueryParamsForApp();

      if (context.q) {
        Object.keys(context.q).forEach((dataItem) => {
          if (typeof queryParams[dataItem] !== "undefined") {
            context.q[dataItem] = this.getTypedValue(queryParams[dataItem]);
          }
        });
      }
    },
    // used only by core to extract query parameters from URL
    getQueryParamsForCore() {
      if (
        !window.location.hash.includes("?") ||
        window.location.hash.split("?").length < 2
      ) {
        return {};
      }

      const params = new URLSearchParams(window.location.hash.split("?").pop());
      let queryParams = {};

      params.forEach((value, key) => {
        if (key) {
          queryParams[key] = value;
        }
      });
      return queryParams;
    },
    // used only by external apps to extract query parameters from URL
    getQueryParamsForApp() {
      if (
        !window.parent.location.hash.includes("?") ||
        window.parent.location.hash.split("?").length < 2
      ) {
        return {};
      }

      const params = new URLSearchParams(
        window.parent.location.hash.split("?").pop()
      );
      let queryParams = {};

      params.forEach((value, key) => {
        if (key) {
          queryParams[key] = value;
        }
      });
      return queryParams;
    },
  },
};
