/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { formatDistance, subDays, isBefore } from "date-fns";
import { parseISO } from "date-fns";
import { format, utcToZonedTime } from "date-fns-tz";

export default {
  name: "DateTimeService",
  data() {
    return {
      formatDate: format,
      formatDateDistance: formatDistance,
      subDays,
      parseIsoDate: parseISO,
      dateIsBefore: isBefore,
    };
  },
  methods: {
    formatInTimeZone(date, fmt, tz) {
      return format(utcToZonedTime(date, tz), fmt, { timeZone: tz });
    },
  },
};
