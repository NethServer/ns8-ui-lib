<template>
  <div
    :class="[
      `cv-text-input`,
      `ns-text-input`,
      `${carbonPrefix}--form-item`,
      `${carbonPrefix}--text-input-wrapper`,
      { [`${carbonPrefix}--password-input-wrapper`]: isPassword },
    ]"
  >
    <div v-if="hasTooltipSlot">
      <label
        :for="uid"
        :class="[
          `${carbonPrefix}--label`,
          {
            [`${carbonPrefix}--label--disabled`]:
              $attrs.disabled !== undefined && $attrs.disabled,
          },
        ]"
        >{{ label }}</label
      >
      <!-- tooltip -->
      <cv-interactive-tooltip
        :alignment="tooltipAlignment"
        :direction="tooltipDirection"
        class="tooltip info"
      >
        <template slot="content">
          <slot name="tooltip"></slot>
        </template>
      </cv-interactive-tooltip>
    </div>
    <label
      v-else
      :for="uid"
      :class="[
        `${carbonPrefix}--label`,
        {
          [`${carbonPrefix}--label--disabled`]:
            $attrs.disabled !== undefined && $attrs.disabled,
        },
      ]"
      >{{ label }}</label
    >
    <div
      :class="[
        `${carbonPrefix}--text-input__field-wrapper`,
        {
          [`${carbonPrefix}--text-input__field-wrapper--warning`]:
            !isInvalid && isWarn,
        },
        { 'align-items-center': prefix },
      ]"
      :data-invalid="isInvalid"
    >
      <WarningFilled16
        v-if="isInvalid"
        :class="`${carbonPrefix}--text-input__invalid-icon`"
      />
      <WarningAltFilled16
        v-if="isWarn"
        :class="`${carbonPrefix}--text-input__invalid-icon ${carbonPrefix}--text-input__invalid-icon--warning`"
      />
      <span v-if="prefix" class="prefix">{{ prefix }}</span>
      <input
        :id="uid"
        :class="[
          `${carbonPrefix}--text-input`,
          {
            [`${carbonPrefix}--text-input--light`]: isLight,
            [`${carbonPrefix}--text-input--invalid`]: isInvalid,
            [`${carbonPrefix}--text-input--warning`]: isWarn,
            [`${carbonPrefix}--password-input`]: isPassword,
          },
        ]"
        v-bind="$attrs"
        :value="value"
        v-on="inputListeners"
        :data-toggle-password-visibility="isPassword"
        :type="dataType"
        ref="input"
      />
      <button
        v-if="isPassword"
        :class="[
          `${carbonPrefix}--btn`,
          `${carbonPrefix}--text-input--password__visibility__toggle`,
          `${carbonPrefix}--tooltip__trigger`,
          `${carbonPrefix}--tooltip--a11y`,
          `${carbonPrefix}--tooltip--bottom`,
          `${carbonPrefix}--tooltip--align-end`,
        ]"
        @click="togglePasswordVisibility"
        type="button"
      >
        <span :class="`${carbonPrefix}--assistive-text`">{{
          passwordHideShowLabel
        }}</span>
        <ViewOff16
          v-if="isPasswordVisible"
          :class="`${carbonPrefix}--icon-visibility-off`"
        />
        <View16 v-else :class="`${carbonPrefix}--icon-visibility-off`" />
      </button>
    </div>
    <div :class="`${carbonPrefix}--form-requirement`" v-if="isInvalid">
      <slot name="invalid-message">{{ invalidMessage }}</slot>
    </div>
    <div v-if="isWarn" :class="`${carbonPrefix}--form__requirement`">
      <slot name="warn-text">{{ warnText }}</slot>
    </div>
    <div
      v-if="isHelper"
      :class="[
        `${carbonPrefix}--form__helper-text`,
        { [`${carbonPrefix}--form__helper-text--disabled`]: $attrs.disabled },
      ]"
    >
      <slot name="helper-text">{{ helperText }}</slot>
    </div>
  </div>
</template>

<script>
import { CvTextInput } from "@carbon/vue";
import {
  WarningFilled16,
  WarningAltFilled16,
  View16,
  ViewOff16,
} from "@carbon/icons-vue";

export default {
  name: "NsTextInput",
  extends: CvTextInput,
  components: { WarningFilled16, WarningAltFilled16, View16, ViewOff16 },
  props: {
    helperText: { type: String, default: undefined },
    invalidMessage: { type: String, default: undefined },
    label: String,
    passwordHideLabel: { type: String, default: "Hide password" },
    passwordShowLabel: { type: String, default: "Show password" },
    passwordVisible: Boolean,
    type: String,
    value: String,
    warnText: { type: String, default: undefined },
    tooltipAlignment: {
      type: String,
      default: "center",
      validator: (val) => ["start", "center", "end"].includes(val),
    },
    tooltipDirection: {
      type: String,
      default: "bottom",
      validator: (val) => ["top", "left", "bottom", "right".includes(val)],
    },
    prefix: String,
  },
  computed: {
    hasTooltipSlot() {
      return !!this.$slots.tooltip;
    },
  },
};
</script>

<style scoped lang="scss">
.tooltip {
  display: inline-block;
  position: absolute;
}

.prefix {
  font-weight: bold;
  margin-right: 0.5rem;
}

.align-items-center {
  align-items: center;
}
</style>

<style lang="scss">
// global styles

.ns-text-input .bx--tooltip__label .bx--tooltip__trigger {
  margin-left: 0.25rem;
}
</style>
