<template>
  <div
    data-modal
    :id="uid"
    :class="[
      `cv-modal ${carbonPrefix}--modal`,
      `wizard-modal`,
      {
        'is-visible': dataVisible,
      },
    ]"
    tabindex="-1"
    @keydown.esc.prevent="onEsc"
    @click.self="onExternalClick"
  >
    <div
      :class="[
        `${carbonPrefix}--modal-container`,
        { [`${carbonPrefix}--modal-container--${internalSize}`]: internalSize },
      ]"
      v-bind="dialogAttrs"
      ref="modalDialog"
    >
      <div
        class="cv-modal__before-content"
        ref="beforeContent"
        tabindex="0"
        style="position: absolute; height: 1px; width: 1px; left: -9999px"
        @focus="focusBeforeContent"
      />
      <div :class="`${carbonPrefix}--modal-header`">
        <p :class="`${carbonPrefix}--modal-header__label`">
          <slot name="label"></slot>
        </p>
        <p :class="`${carbonPrefix}--modal-header__heading`">
          <slot name="title">Modal Title</slot>
        </p>
        <button
          :class="`${carbonPrefix}--modal-close`"
          type="button"
          @click="onClose"
          ref="close"
          :aria-label="closeAriaLabel"
        >
          <Close16 :class="`${carbonPrefix}--modal-close__icon`" />
        </button>
      </div>
      <div
        :class="[
          `${carbonPrefix}--modal-content`,
          { [`${carbonPrefix}--modal-content--with-form`]: hasFormContent },
        ]"
        ref="content"
        :tabindex="scrollable ? 0 : undefined"
      >
        <slot name="content"></slot>
      </div>

      <cv-button-set
        :class="[
          `${carbonPrefix}--modal-footer`,
          `${carbonPrefix}--modal-footer--three-button`,
        ]"
      >
        <NsButton
          kind="secondary"
          :icon="Close20"
          @click="$emit('cancel')"
          :disabled="isCancelDisabled"
          type="button"
          class="wizard-button"
          ref="wizardCancel"
          >{{ cancelLabel }}
        </NsButton>
        <NsButton
          kind="secondary"
          :icon="ChevronLeft20"
          @click="$emit('previousStep')"
          :disabled="isPreviousDisabled"
          type="button"
          class="wizard-button"
          ref="wizardPrevious"
          >{{ previousLabel }}
        </NsButton>
        <NsButton
          kind="primary"
          :icon="ChevronRight20"
          @click="$emit('nextStep')"
          :disabled="isNextDisabled"
          :loading="isNextLoading"
          type="submit"
          class="wizard-button"
          ref="wizardNext"
          >{{ nextLabel }}
        </NsButton>
      </cv-button-set>
      <div
        class="cv-modal__after-content"
        ref="afterContent"
        tabindex="0"
        style="position: absolute; height: 1px; width: 1px; left: -9999px"
        @focus="focusAfterContent"
      />
    </div>
  </div>
</template>

<script>
import NsModal from "./NsModal";
import IconService from "../lib-mixins/icon.js";

export default {
  name: "NsWizard",
  extends: NsModal,
  mixins: [IconService],
  props: {
    cancelLabel: { type: String, default: "Cancel" },
    previousLabel: { type: String, default: "Previous" },
    nextLabel: { type: String, default: "Next" },
    isPreviousDisabled: Boolean,
    isNextDisabled: Boolean,
    isCancelDisabled: Boolean,
    isNextLoading: Boolean,
    closeAriaLabel: { type: String, default: "Close modal" },
    autoHideOff: Boolean,
    visible: Boolean,
    size: String,
  },
  methods: {
    focusBeforeContent() {
      this.$nextTick(() => {
        if (this.isNextDisabled) {
          this.$refs.wizardCancel.$el.focus();
        } else {
          this.$refs.wizardNext.$el.focus();
        }
      });
    },
  },
};
</script>
