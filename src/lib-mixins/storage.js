/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export default {
  name: "StorageService",
  methods: {
    getFromStorage(prop) {
      return JSON.parse(localStorage.getItem(prop));
    },
    saveToStorage(prop, object) {
      localStorage.setItem(prop, JSON.stringify(object));
    },
    deleteFromStorage(prop) {
      localStorage.removeItem(prop);
    },
  },
};
