/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import GhostLottie from "./lottie/ghost.json";
import GhostDarkBgLottie from "./lottie/ghost-dark-bg.json";
import RocketLottie from "./lottie/rocket.json";
import GearsLottie from "./lottie/gears.json";

export default {
  name: "IconService",
  data() {
    return {
      GhostLottie,
      GhostDarkBgLottie,
      RocketLottie,
      GearsLottie,
    };
  },
};
