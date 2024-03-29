/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { v4 as uuidv4 } from "uuid";

export default {
  name: "UtilService",
  data() {
    return {
      DELETE_DELAY: 7000, // you have 7 seconds to cancel object deletion
      time24HourPattern: /([01]\d|2[0-3]):?([0-5]\d)/,
      time24HourPatternString: "([01]\\d|2[0-3]):?([0-5]\\d)",
      time24HourPlaceholder: "hh:mm",
      // used to highlight the anchor the user has just navigated to
      highlightAnchor: "",
      ipAddressPattern: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
      cidrPattern: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}\/(\d){1,2}$/,
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
    /**
     * Clear errors inside context. Used to clear previous errors before input data validation
     */
    clearErrors() {
      this.clearStrings(this.error);
    },
    clearStrings(obj) {
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] == "string") {
          obj[key] = "";
        } else if (typeof obj[key] == "boolean") {
          obj[key] = false;
        } else if (typeof obj[key] == "object") {
          // recursion
          this.clearStrings(obj[key]);
        } else {
          console.error("unexpected object type:", typeof obj[key]);
        }
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
     * Smoothly scroll to a specific element in the page
     */
    scrollToElement(element) {
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    /**
     * Scroll to anchor if route contains a hash (#) and highlight the related element.
     * Used when navigating to a specific anchor link on a different page
     */
    checkAndScrollToAnchor() {
      this.$nextTick(function () {
        if (this.$route.hash) {
          const refName = this.$route.hash.replace("#", "");
          const el = this.$refs[refName];
          this.scrollToElement(el);

          // highlight the anchor element
          this.highlightAnchor = refName;
        }
      });
    },
    /**
     * Get app description using the locale of core context
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
     * Get app categories using the locale of core context
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
    /**
     * Used in views and components containing an accordion
     */
    toggleAccordion(ev) {
      this.$refs.accordion.state.map(
        (item, index) => index === ev.changedIndex
      );
    },
    /**
     * Used in Backup section
     * */
    getBackupScheduleDescription(schedule) {
      if (!schedule) {
        return "-";
      }

      switch (schedule.interval) {
        case "hourly":
          if (schedule.minute == 0) {
            return this.$t("backup.every_hour");
          } else {
            return this.$tc("backup.minutes_past_the_hour", schedule.minute, {
              minutes: schedule.minute,
            });
          }
        case "daily":
          if (this.time24HourPattern.test(schedule.time)) {
            return this.$t("backup.every_day_at", { time: schedule.time });
          } else {
            return "-";
          }
        case "weekly":
          if (this.time24HourPattern.test(schedule.time)) {
            return this.$t("backup.every_weekday_at_hour", {
              weekDay: this.$t("calendar." + schedule.weekDay),
              time: schedule.time,
            });
          } else {
            return "-";
          }
        case "monthly":
          if (this.time24HourPattern.test(schedule.time)) {
            return this.$t("backup.every_month_at_time", {
              dayNum: schedule.monthDay,
              time: schedule.time,
            });
          } else {
            return "-";
          }
        default:
          return "-";
      }
    },
    /**
     * Get the base64 representation of a file
     */
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    /**
     * Navigate to a page of an external app. Use this method only from an external app (e.g. from AppSideMenuContent)
     */
    goToAppPage(instanceName, page, query) {
      const path = `/apps/${instanceName}?page=${page}`;

      if (this.core.$route.fullPath != path) {
        if (query) {
          this.core.$router.push({ path: path, query: query });
        } else {
          this.core.$router.push(path);
        }
      }
    },
    /**
     * Generate a universally unique identifier
     */
    getUuid() {
      return uuidv4();
    },
    /**
     * Get a readable label for a node
     */
    getNodeLabel(node) {
      return node.ui_name
        ? node.ui_name + " (" + this.$t("common.node") + " " + node.id + ")"
        : this.$t("common.node") + " " + node.id;
    },
    /**
     * Get a readable short label for a node
     */
    getShortNodeLabel(node) {
      return node.ui_name
        ? node.ui_name
        : this.$t("common.node") + " " + node.id;
    },
    /**
     * Get a i18n string using a fallback key if necessary. Used for common validation errors
     */
    getI18nStringWithFallback(key, fallbackKey, coreContext, args) {
      if (this.$te(key)) {
        return this.$t(key, args);
      }

      // fallback
      if (this.$te(fallbackKey)) {
        return this.$t(fallbackKey, args);
      }

      if (!coreContext) {
        // return key as is
        return key;
      }

      // try on core context
      if (coreContext.$te(key)) {
        return coreContext.$t(key, args);
      }

      // fallback on core context
      if (coreContext.$te(fallbackKey)) {
        return coreContext.$t(fallbackKey, args);
      }

      // return key as is
      return key;
    },
    /**
     * Decode a jwt token and parse its payload
     */
    decodeJwtPayload(token) {
      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    },
    /**
     * get the SHA256 digest of a string
     */
    async getSha256(message) {
      // encode as UTF-8
      const msgBuffer = new TextEncoder().encode(message);

      // hash the message
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

      // convert ArrayBuffer to Array
      const hashArray = Array.from(new Uint8Array(hashBuffer));

      // convert bytes to hex string
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    },
  },
};
