/*
 * Copyright (C) 2026 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// Global Vue setup shared by Storybook and the playground. It mirrors what
// ns8-core and module UIs register before using the library.

import "./global.scss";

import Vue from "vue";

// Carbon components
import CarbonComponentsVue from "@carbon/vue";
Vue.use(CarbonComponentsVue);

// Library components and filters, resolved to src/ by the bundler alias
import ns8Lib, { Filters } from "@nethserver/ns8-ui-lib";
Vue.use(ns8Lib);
for (const f in Filters) {
  Vue.filter(f, Filters[f]);
}

import VueDateFns from "vue-date-fns";
Vue.use(VueDateFns);

// used by NsTimePicker
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
Vue.component("vue-timepicker", VueTimepicker);

// v-debounce directive, used by NsComboSearchBox and NsDataTable
import vueDebounce from "vue-debounce";
Vue.use(vueDebounce);
