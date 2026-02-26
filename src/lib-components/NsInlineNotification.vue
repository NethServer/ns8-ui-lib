<!--
  Copyright (C) 2023 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<template>
  <div
    data-notification
    :class="[
      'cv-inline-notification',
      `${carbonPrefix}--inline-notification`,
      `${carbonPrefix}--inline-notification--${kind.toLowerCase()}`,
      {
        [`${carbonPrefix}--inline-notification--low-contrast`]: lowContrast
      }
    ]"
    v-on="$listeners"
    :role="isAlert ? 'alert' : false"
    :aria-live="!isAlert ? 'polite' : false"
  >
    <div :class="`${carbonPrefix}--inline-notification__details details`">
      <component
        :is="icon"
        :class="`${carbonPrefix}--inline-notification__icon`"
      />
      <div :class="`${carbonPrefix}--inline-notification__text-wrapper`">
        <p
          v-if="$slots.title || title"
          :class="`${carbonPrefix}--inline-notification__title title`"
        >
          <slot v-if="$slots.title" name="title"></slot>
          <span v-else>{{ title }}</span>
        </p>
        <p
          v-if="$slots.description || description"
          :class="[
            `${carbonPrefix}--inline-notification__subtitle`,
            { 'mg-right': loading || timer }
          ]"
        >
          <slot v-if="$slots.description" name="description"></slot>
          <span v-else>{{ description }}</span>
        </p>
        <p v-if="loading" class="loader"></p>
        <p v-if="timer">
          <NsCircleTimer
            :timeLimit="timer"
            :size="16"
            :strokeWidth="20"
            color="white"
          />
        </p>
      </div>
    </div>
    <button
      v-if="actionLabel"
      @click="$emit('action')"
      :class="[
        `${carbonPrefix}--inline-notification__action-button`,
        `${carbonPrefix}--btn`,
        `${carbonPrefix}--btn--sm`,
        `${carbonPrefix}--btn--ghost`,
        'action-button'
      ]"
      type="button"
    >
      {{ actionLabel }}
    </button>
    <button
      v-if="showCloseButton"
      type="button"
      :aria-label="closeAriaLabel"
      data-notification-btn
      :class="`${carbonPrefix}--inline-notification__close-button`"
      @click="$emit('close')"
    >
      <Close20 :class="`${carbonPrefix}--inline-notification__close-icon`" />
    </button>
  </div>
</template>

<script>
import { CvInlineNotification } from "@carbon/vue";
import NsCircleTimer from "./NsCircleTimer.vue";

export default {
  name: "NsInlineNotification",
  extends: CvInlineNotification,
  components: { NsCircleTimer },
  props: {
    showCloseButton: {
      type: Boolean,
      default: false
    },
    description: String,
    actionLabel: { type: String, default: "" },
    closeAriaLabel: { type: String, default: "Dismiss notification" },
    kind: {
      type: String,
      default: "info",
      validator: (val) => ["error", "info", "warning", "success"].includes(val)
    },
    lowContrast: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    timer: {
      type: Number
    }
  }
};
</script>

<style scoped lang="scss">
.title {
  margin-right: 0.75rem;
  margin-bottom: 0.2rem;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
}

.mg-right {
  margin-right: 0.75rem;
}

.action-button {
  margin-right: 0.5rem;
}

.bx--inline-notification__text-wrapper p {
  // needed for inline notifications inside modal
  padding-right: 0 !important;
}
</style>
