<template>
  <div
    class="ns-checkbox cv-checkbox"
    :class="[
      `${carbonPrefix}--checkbox-wrapper`,
      { [`${carbonPrefix}--form-item`]: formItem },
    ]"
  >
    <input
      ref="input"
      v-bind="$attrs"
      v-on="inputListeners"
      :class="`${carbonPrefix}--checkbox`"
      type="checkbox"
      :checked="isChecked === true"
      :aria-checked="`${isChecked}`"
      @focus="onFocus"
      @blur="onBlur"
      :value="value"
      :id="uid"
    />
    <label
      :class="[
        `${carbonPrefix}--checkbox-label`,
        {
          [`${carbonPrefix}--label--disabled`]:
            $attrs.disabled !== undefined && this.$attrs.disabled,
          [`${carbonPrefix}--checkbox-label__focus`]: hasFocus,
        },
      ]"
      :data-contained-checkbox-state="isChecked"
      :data-contained-checkbox-disabled="$attrs.disabled"
      :for="uid"
    >
      <!-- <span ////
        :class="[
          `${carbonPrefix}--checkbox-label-text`,
          { [`${carbonPrefix}--visually-hidden`]: hideLabel },
        ]"
      >
        {{ label }}
      </span> -->
      <div
        :class="[
          `${carbonPrefix}--checkbox-label-text`,
          { [`${carbonPrefix}--visually-hidden`]: hideLabel },
        ]"
      >
        <div class="label-with-tooltip">
          <span v-html="label"></span>
          <!-- tooltip -->
          <cv-interactive-tooltip
            v-if="hasTooltipSlot"
            :alignment="tooltipAlignment"
            :direction="tooltipDirection"
            class="info"
          >
            <template slot="content">
              <slot name="tooltip"></slot>
            </template>
          </cv-interactive-tooltip>
        </div>
      </div>
    </label>
  </div>
</template>

<script>
import { CvCheckbox } from "@carbon/vue";

export default {
  name: "NsCheckbox",
  extends: CvCheckbox,
  inheritAttrs: false,
  props: {
    hideLabel: Boolean,
    label: String,
    mixed: Boolean,
    formItem: { type: Boolean, default: true },
    tooltipAlignment: {
      type: String,
      default: "start",
      validator: (val) => ["start", "center", "end"].includes(val),
    },
    tooltipDirection: {
      type: String,
      default: "bottom",
      validator: (val) => ["top", "left", "bottom", "right".includes(val)],
    },
  },
  computed: {
    hasTooltipSlot() {
      return !!this.$slots.tooltip;
    },
  },
};
</script>

<style scoped lang="scss">
.label-with-tooltip {
  display: flex;
}
</style>

<style lang="scss">
// global styles

.ns-checkbox .bx--tooltip__label .bx--tooltip__trigger {
  margin-left: 0.25rem;
}
</style>
