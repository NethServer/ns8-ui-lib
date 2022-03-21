<template>
  <div>
    <div
      data-notification
      :class="[
        `cv-notifiation ${carbonPrefix}--toast-notification`,
        `${carbonPrefix}--toast-notification--${kind.toLowerCase()}`,
        { [`${carbonPrefix}--toast-notification--low-contrast`]: lowContrast },
        `notification`,
        { 'notification-read': isRead },
      ]"
      v-on="$listeners"
      :role="isAlert ? 'alert' : undefined"
      :aria-live="!isAlert ? 'polite' : false"
    >
      <component
        :is="icon"
        :class="`${carbonPrefix}--toast-notification__icon`"
      />
      <div :class="`${carbonPrefix}--toast-notification__details`">
        <h3 :class="`${carbonPrefix}--toast-notification__title`">
          {{ title }}
        </h3>
        <div
          :class="[
            `${carbonPrefix}--toast-notification__subtitle`,
            `notification-description-and-progress`,
            `row`,
            { 'fix-margin-bottom': actionLabel || isProgressShown },
          ]"
        >
          <span v-html="description"></span>

          <div v-if="isProgressShown" class="progress">
            <NsProgressBar :value="progress" :indeterminate="!progress" />
            <div class="progress-bar-spacer"></div>
            <div v-if="progress" class="progress-number">{{ progress }} %</div>
          </div>
        </div>

        <!-- cancel button -->
        <div
          v-if="isProgressShown"
          :class="[
            `${carbonPrefix}--toast-notification__caption`,
            `action`,
            `row`,
          ]"
        >
          <button
            @click="cancelTask"
            :class="[
              `${carbonPrefix}--inline-notification__action-button`,
              `${carbonPrefix}--btn`,
              `${carbonPrefix}--btn--sm`,
              { 'bx--btn--ghost': !isConfirmCancelShown },
              { 'bx--btn--danger': isConfirmCancelShown },
            ]"
            :disabled="isCancelButtonDisabled"
            type="button"
          >
            {{ isConfirmCancelShown ? confirmCancelLabel : cancelLabel }}
          </button>
        </div>

        <!-- action button -->
        <div
          v-else-if="actionLabel"
          :class="[
            `${carbonPrefix}--toast-notification__caption`,
            `action`,
            `row`,
          ]"
        >
          <button
            @click="$emit('notificationAction', id)"
            :class="[
              `${carbonPrefix}--inline-notification__action-button`,
              `${carbonPrefix}--btn`,
              `${carbonPrefix}--btn--sm`,
              `${carbonPrefix}--btn--ghost`,
            ]"
            type="button"
          >
            {{ actionLabel }}
          </button>
        </div>

        <div v-if="timestamp && !isProgressShown" class="timestamp row">
          <cv-tooltip
            alignment="center"
            direction="bottom"
            :tip="formatDate(timestamp, 'yyyy-MM-dd HH:mm:ss')"
          >
            {{
              formatDateDistance(timestamp, new Date(), {
                addSuffix: true,
              })
            }}
          </cv-tooltip>
        </div>
      </div>
      <button
        v-if="showCloseButton"
        :aria-label="closeAriaLabel"
        type="button"
        data-notification-btn
        :class="`${carbonPrefix}--toast-notification__close-button`"
        @click="$emit('close-toast')"
      >
        <Close20 :class="`${carbonPrefix}--toast-notification__close-icon`" />
      </button>
    </div>
  </div>
</template>

<script>
import { CvToastNotification, CvLink, CvTooltip } from "@carbon/vue";
import DateTimeService from "../lib-mixins/dateTime.js";
import NsProgressBar from "./NsProgressBar";

export default {
  name: "NsToastNotification",
  extends: CvToastNotification,
  components: { NsProgressBar, CvLink, CvTooltip },
  mixins: [DateTimeService],
  props: {
    id: String,
    description: String,
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    actionLabel: String,
    action: Object,
    isRead: {
      type: Boolean,
      default: false,
    },
    progress: Number,
    timestamp: Date,
    isProgressShown: {
      type: Boolean,
      default: false,
    },
    cancelLabel: { type: String, default: "Abort" },
    confirmCancelLabel: { type: String, default: "Confirm abort" },
    closeAriaLabel: { type: String, default: "Dismiss notification" },
    kind: {
      type: String,
      default: "info",
      validator: (val) => ["error", "info", "warning", "success"].includes(val),
    },
    lowContrast: Boolean,
  },
  data() {
    return {
      isConfirmCancelShown: false,
      isCancelButtonDisabled: false,
    };
  },
  methods: {
    cancelTask() {
      if (!this.isConfirmCancelShown) {
        // show confirmation
        this.isConfirmCancelShown = true;

        setTimeout(() => {
          this.isConfirmCancelShown = false;
        }, 5000);
      } else {
        // cancel task
        this.$emit("cancelTask", this.id);
        this.isCancelButtonDisabled = true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.notification {
  margin-bottom: 0;
  margin-right: 0;
}

.action {
  padding-top: 0;
  margin-bottom: 0;
}

.bx--toast-notification .bx--inline-notification__action-button {
  // following rule uses branding color so it's inside core _core.scss
  // color: $inverse-link;
  margin-left: -1rem;
}

@media (min-width: 42rem) {
}
.bx--toast-notification
  .bx--inline-notification__action-button.bx--btn--danger {
  margin: 0.5rem 0 0.5rem -1rem;
}

.notification-description-and-progress {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

.fix-margin-bottom {
  margin-bottom: 0;
}

.progress {
  margin-top: 0.75rem;
}

.progress-bar-spacer {
  height: 0.5rem;
}

.cv-notifiation.bx--toast-notification.notification {
  width: 26vw;
  min-width: 20rem;
  margin-top: 0;
}

.notification-drawer .cv-notifiation.bx--toast-notification.notification {
  margin-top: 1rem;
}

.notification-drawer .cv-notifiation.bx--toast-notification.notification {
  width: 100%;
  cursor: pointer;
}

.notification-read {
  border-color: #8d8d8d;
  color: #c6c6c6;
}

.notification-read .bx--toast-notification__icon {
  // gray icon for read notifications
  fill: currentColor;
}

.notification-read .bx--toast-notification__subtitle {
  color: #c6c6c6;
}

.notification-read .bx--toast-notification__title {
  font-weight: normal;
}

.cv-notifiation .timestamp {
  margin-bottom: 0.75rem;
  line-height: 1.29;
  color: #ffffff;
  text-decoration: underline;
}

.cv-notifiation .timestamp button {
  color: #c6c6c6;
}

.bx--tooltip__trigger:not(.bx--btn--icon-only) {
  font-size: inherit;
}

.cv-notifiation .timestamp .bx--tooltip__trigger::before {
  border-bottom-color: #161616;
}

div.row:last-child {
  margin-bottom: 1.5rem;
}

.bx--toast-notification__details {
  flex-grow: 1;
}
</style>

<style lang="scss">
// global styles

.cv-notifiation .timestamp button span {
  background-color: #161616 !important;
  border-left: 1px solid #393939;
  border-right: 1px solid #393939;
  border-bottom: 1px solid #393939;
}
</style>
