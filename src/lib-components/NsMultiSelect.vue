<!--
  Copyright (C) 2023 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<template>
  <div
    :class="[
      `ns-multi-select cv-multi-select ${carbonPrefix}--multi-select__wrapper ${carbonPrefix}--list-box__wrapper`,
      {
        [`${carbonPrefix}--multi-select__wrapper--inline ${carbonPrefix}--list-box__wrapper--inline`]:
          inline,
        [`${carbonPrefix}--multi-select__wrapper--inline--invalid ${carbonPrefix}--list-box__wrapper--inline--invalid`]:
          inline && isInvalid,
        [`${carbonPrefix}--multi-select--filterable`]: filterable,
        'margin-bottom-on-open': marginBottomOnOpenEnabled,
      },
    ]"
    @focusout="onFocusOut"
  >
    <label
      v-if="title"
      :for="uid"
      :class="[
        `${carbonPrefix}--label`,
        { [`${carbonPrefix}--label--disabled`]: disabled },
      ]"
    >
      <div class="label-with-tooltip">
        <span>
          {{ title }}
        </span>
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
    </label>

    <div
      role="listbox"
      tabindex="-1"
      :class="[
        `${carbonPrefix}--multi-select ${carbonPrefix}--list-box`,
        {
          [`${carbonPrefix}--list-box--light`]: isLight,
          [`${carbonPrefix}--list-box--expanded`]: open,
          [`${carbonPrefix}--multi-select--invalid`]: isInvalid,
          [`${carbonPrefix}--multi-select--disabled`]: disabled,
          [`${carbonPrefix}--list-box--disabled`]: disabled,
          [`${carbonPrefix}--multi-select--inline`]: inline,
          [`${carbonPrefix}--list-box--inline`]: inline,
          [`${carbonPrefix}--multi-select--selected`]: dataValue.length > 0,
          [`${carbonPrefix}--combo-box`]: filterable,
        },
      ]"
      :data-invalid="isInvalid"
      v-bind="$attrs"
      @keydown.down.prevent="onDown"
      @keydown.up.prevent="onUp"
      @keydown.enter.prevent="onEnter"
      @keydown.esc.prevent.stop="onEsc"
      @click="onClick"
    >
      <WarningFilled16
        v-if="isInvalid"
        :class="`${carbonPrefix}--list-box__invalid-icon`"
      />
      <div
        role="button"
        aria-haspopup="true"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-owns="uid"
        :aria-controls="uid"
        :class="`${carbonPrefix}--list-box__field`"
        tabindex="0"
        type="button"
        :aria-label="open ? 'close menu' : 'open menu'"
        data-toggle="true"
        ref="button"
      >
        <NsTag
          :class="{
            [`${carbonPrefix}--list-box__selection--multi`]:
              filterable && dataValue.length > 0,
          }"
          :disabled="disabled"
          v-show="dataValue.length > 0"
          :kind="filterTagKind"
          filter
          :clear-aria-label="clearSelectionAriaLabel"
          :label="`${dataValue.length} ${selectedLabel}`"
          @remove="clearValues"
          ref="tag"
          :style="filterableTagOverride"
        />
        <span v-if="!filterable" :class="`${carbonPrefix}--list-box__label`">{{
          label
        }}</span>
        <template v-else>
          <input
            ref="input"
            :class="[
              `${carbonPrefix}--text-input`,
              {
                [`${carbonPrefix}--text-input--empty`]:
                  !filter || filter.length === 0,
              },
            ]"
            :aria-controls="uid"
            aria-autocomplete="list"
            role="combobox"
            :aria-expanded="open ? 'true' : 'false'"
            autocomplete="off"
            :placeholder="label"
            v-model="filter"
            @input="onInput"
            @focus="inputFocus"
            @click.stop.prevent="inputClick"
            :disabled="disabled"
          />
          <div
            v-if="filter.length > 0"
            role="button"
            :class="`${carbonPrefix}--list-box__selection`"
            tabindex="0"
            :title="clearFilterLabel"
            @click.stop="clearFilter"
            @keydown.enter.stop.prevent="clearFilter"
            @keydown.space.stop.prevent
            @keyup.space.stop.prevent="clearFilter"
          >
            <Close16 />
          </div>
        </template>
        <div
          :class="[
            `${carbonPrefix}--list-box__menu-icon`,
            { [`${carbonPrefix}--list-box__menu-icon--open`]: open },
          ]"
          role="button"
        >
          <chevron-down-16 :aria-label="open ? 'Close menu' : 'Open menu'" />
        </div>
      </div>

      <div
        :id="uid"
        :class="`${carbonPrefix}--list-box__menu`"
        role="listbox"
        ref="list"
      >
        <div
          v-for="(item, index) in filteredOptions"
          :key="`multi-select-${index}`"
          :class="[
            `${carbonPrefix}--list-box__menu-item`,
            {
              [`${carbonPrefix}--list-box__menu-item--highlighted`]:
                highlighted === item.value,
            },
          ]"
          ref="option"
          @click.stop.prevent="onItemClick(item.value)"
          @mousemove="onMousemove(item.value)"
          @mousedown.prevent
        >
          <div :class="`${carbonPrefix}--list-box__menu-item__option`">
            <cv-checkbox
              tabindex="-1"
              :form-item="false"
              v-model="dataValue"
              :value="item.value"
              :name="item.name"
              :data-test="item.name"
              :label="getItemLabel(item)"
              style="pointer-events: none"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isInvalid && !inline"
      :class="`${carbonPrefix}--form-requirement`"
    >
      <slot name="invalid-message">{{ invalidMessage }}</slot>
    </div>
    <div
      v-if="!inline && !isInvalid && isHelper"
      :class="[
        `${carbonPrefix}--form__helper-text`,
        { [`${carbonPrefix}--form__helper-text--disabled`]: disabled },
      ]"
    >
      <slot name="helper-text">{{ helperText }}</slot>
    </div>
    <!-- show selected items -->
    <div v-if="showSelectedItems && dataValue.length" class="selected-items">
      <NsTag
        v-for="(item, index) in selectedItems"
        filter
        @remove="onItemClick(item ? item.value : '')"
        size="sm"
        :clear-aria-label="unselectAriaLabel"
        :key="index"
        :label="item ? item.label : ''"
        :kind="selectedItemsColor"
        :disabled="disabled"
        class="selected-item"
      />
    </div>
  </div>
</template>

<script>
import {
  themeMixin,
  uidMixin,
  carbonPrefixMixin,
  methodsMixin,
} from "@carbon/vue/src/mixins";
import WarningFilled16 from "@carbon/icons-vue/es/warning--filled/16";
import ChevronDown16 from "@carbon/icons-vue/es/chevron--down/16";
import Close16 from "@carbon/icons-vue/es/close/16";
import CvCheckbox from "@carbon/vue/src/components/cv-checkbox/cv-checkbox";
import _cloneDeep from "lodash/cloneDeep";
import NsTag from "./NsTag.vue";

const TOP_AFTER_REOPEN = 0;
const TOP = 1;
const FIXED = 2;
const selectionFeedbackOptions = ["top-after-reopen", "top", "fixed"];

export default {
  name: "NsMultiSelect",
  inheritAttrs: false,
  mixins: [
    themeMixin,
    uidMixin,
    carbonPrefixMixin,
    methodsMixin({ button: ["blur", "focus"] }),
  ],
  components: { WarningFilled16, ChevronDown16, CvCheckbox, NsTag, Close16 },
  props: {
    autoFilter: Boolean,
    autoHighlight: Boolean,
    disabled: Boolean,
    filterTagKind: { type: String, default: "high-contrast" },
    inline: Boolean,
    invalidMessage: { type: String, default: undefined },
    helperText: { type: String, default: undefined },
    title: String,
    label: {
      type: String,
      default: "Choose",
    },
    highlight: String,
    // initial value of the multi-select,
    // options in the form
    // [{ label: '', value: '', name: ''}]
    value: { type: Array, default: () => [] },
    options: {
      type: Array,
      required: true,
      validator(list) {
        const result = list.every(
          (item) =>
            typeof item.name === "string" &&
            typeof item.label === "string" &&
            typeof item.value === "string"
        );
        if (!result) {
          console.warn(
            "NsMultiSelect - all options must have name, label and value"
          );
        }
        return result;
      },
    },
    selectionFeedback: {
      type: String,
      default: selectionFeedbackOptions[TOP_AFTER_REOPEN],
      validator(val) {
        if (!selectionFeedbackOptions.includes(val)) {
          console.warn(
            `NsMultiSelect: invalid selectionFeedback "${val}", use one of ${selectionFeedbackOptions}`
          );
          return false;
        }
        return true;
      },
    },
    filterable: Boolean,
    showSelectedItems: { type: Boolean, default: true },
    unselectAriaLabel: { type: String, default: "Unselect" },
    clearSelectionAriaLabel: { type: String, default: "Clear selection" },
    clearFilterLabel: { type: String, default: "Clear filter" },
    selectedLabel: { type: String, default: "selected" },
    userInputLabel: { type: String, default: "user input" },
    // limit the number of options to be displayed
    maxDisplayOptions: { type: Number, default: 100 },
    acceptUserInput: { type: Boolean, default: false },
    showItemType: { type: Boolean, default: false },
    showItemDescription: { type: Boolean, default: false },
    // use cv-tag color
    selectedItemsColor: { type: String, default: "high-contrast" },
    marginBottomOnOpen: { type: Boolean, default: false },
    tooltipAlignment: {
      type: String,
      default: "start",
      validator: (val) => ["start", "center", "end"].includes(val),
    },
    tooltipDirection: {
      type: String,
      default: "bottom",
      validator: (val) => ["top", "left", "bottom", "right"].includes(val),
    },
  },
  data() {
    return {
      open: false,
      // includes user input items
      internalOptions: [],
      dataValue: "",
      dataHighlighted: null,
      dataFilter: "",
      isHelper: false,
      isInvalid: false,
      marginBottomOnOpenEnabled: false,
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  watch: {
    highlight() {
      this.highlighted = this.highlight;
    },
    value() {
      // Copy the array, not to change the one of the parent
      this.dataValue = [...this.value];
      this.syncValueWithOptions();
    },
    options() {
      this.internalOptions = _cloneDeep(this.options);
      this.syncValueWithOptions();
    },
    open() {
      if (this.marginBottomOnOpen) {
        if (this.open) {
          setTimeout(() => {
            this.marginBottomOnOpenEnabled = true;
          }, 300);
        } else {
          setTimeout(() => {
            this.marginBottomOnOpenEnabled = false;
          }, 300);
        }
      }
    },
  },
  created() {
    this.internalOptions = _cloneDeep(this.options);
    // copy the array, not to change the one of the parent
    this.dataValue = [...this.value];
    this.syncValueWithOptions();
  },
  mounted() {
    // the value is a list, it cannot be highlighted: without the highlight
    // prop, the first option is highlighted
    this.highlighted = this.highlight;
    this.checkSlots();
  },
  updated() {
    this.checkSlots();
  },
  computed: {
    highlighted: {
      get() {
        return this.dataHighlighted;
      },
      set(val) {
        // only a listed option can be highlighted: the list is filtered by
        // the text typed by the user
        const options = this.filteredOptions;
        let firstMatchIndex = options.findIndex((item) => item.value === val);
        if (firstMatchIndex < 0) {
          firstMatchIndex = options.length ? 0 : -1;
          this.dataHighlighted = firstMatchIndex >= 0 ? options[0].value : "";
        } else {
          this.dataHighlighted = val;
        }
        if (firstMatchIndex >= 0) {
          this.$nextTick(() => {
            // $nextTick to prevent highlight check ahead of list update on filter
            this.checkHighlightPosition(firstMatchIndex);
          });
        }
      },
    },
    filter: {
      get() {
        return this.dataFilter;
      },
      set(val) {
        this.dataFilter = val ? val : "";
        this.$emit("filter", val);
      },
    },
    filterableTagOverride() {
      // <style carbon tweaks - DO NOT USE STYLE TAG as it causes SSR issues
      return this.filterable ? { marginTop: 0, marginBottom: 0 } : {};
    },
    limitedDataOptions() {
      return this.internalOptions.slice(0, this.maxDisplayOptions);
    },
    selectedItems() {
      return this.dataValue.map(
        (val) =>
          this.internalOptions.find((opt) => opt.value === val) || {
            // a value without an option, as the options are not loaded
            // yet: show the value itself
            name: val,
            label: val,
            value: val,
          }
      );
    },
    hasTooltipSlot() {
      return !!this.$slots.tooltip;
    },
    filteredOptions() {
      if (!this.filter) {
        return this.limitedDataOptions;
      }

      const trimmedFilter = this.filter.trim();
      const lowerCaseFilter = trimmedFilter.toLowerCase();

      let results = this.internalOptions.filter(
        (option) =>
          option.label.trim().toLowerCase().includes(lowerCaseFilter) ||
          // list also the option whose value is the text, even if its label
          // does not match
          option.value.trim() === trimmedFilter
      );

      // user input

      if (this.acceptUserInput && trimmedFilter) {
        // suggest user input, unless the text is the label of an option, in
        // any case, or its value: that option is listed above
        const optionFound = this.internalOptions.find(
          (option) =>
            option.label.trim().toLowerCase() === lowerCaseFilter ||
            option.value.trim() === trimmedFilter
        );

        if (!optionFound) {
          results.push({
            name: trimmedFilter,
            label: trimmedFilter,
            value: trimmedFilter,
            type: this.userInputLabel,
          });
        }
      }

      // limit results
      results = results.slice(0, this.maxDisplayOptions);
      return results;
    },
  },
  methods: {
    checkSlots() {
      // NOTE: this.$slots is not reactive so needs to be managed on updated
      this.isInvalid = !!(
        this.$slots["invalid-message"] ||
        (this.invalidMessage && this.invalidMessage.length)
      );
      this.isHelper = !!(
        this.$slots["helper-text"] ||
        (this.helperText && this.helperText.length)
      );
    },
    clearFilter() {
      this.filter = "";
      this.$refs.input.focus();
      this.doOpen(true);
    },
    checkHighlightPosition(newHiglight) {
      if (
        this.$refs.list &&
        this.$refs.option &&
        this.$refs.option[newHiglight]
      ) {
        if (
          this.$refs.list.scrollTop >= this.$refs.option[newHiglight].offsetTop
        ) {
          this.$refs.list.scrollTop = this.$refs.option[newHiglight].offsetTop;
        } else if (
          this.$refs.list.scrollTop + this.$refs.list.clientHeight <
          this.$refs.option[newHiglight].offsetTop +
            this.$refs.option[newHiglight].offsetHeight
        ) {
          this.$refs.list.scrollTop =
            this.$refs.option[newHiglight].offsetTop +
            this.$refs.option[newHiglight].offsetHeight -
            this.$refs.list.clientHeight;
        }
      }
    },
    doMove(up) {
      // move among the listed options, filtered by the text typed by the user
      const options = this.filteredOptions;
      if (options.length > 0) {
        // requery could have changed
        const currentHighlight = options.findIndex(
          (item) => item.value === this.highlighted
        );
        let newHiglight;

        if (up) {
          if (currentHighlight <= 0) {
            newHiglight = options.length - 1;
          } else {
            newHiglight = currentHighlight - 1;
          }
        } else {
          if (currentHighlight >= options.length - 1) {
            newHiglight = 0;
          } else {
            newHiglight = currentHighlight + 1;
          }
        }
        this.highlighted = options[newHiglight].value;
        // this.checkHighlightPosition(newHiglight);
      }
    },
    updateHighlight() {
      // The list is filtered by the text: with autoHighlight, highlight the
      // first listed option; otherwise keep the highlighted option if it is
      // still listed. The setter falls back to the first listed option, so
      // that Enter never picks a hidden one
      const options = this.filteredOptions;
      if (this.autoHighlight && options.length > 0) {
        this.highlighted = options[0].value;
      } else {
        this.highlighted = this.dataHighlighted;
      }
    },
    onInput() {
      this.doOpen(true);
      this.updateHighlight();
    },
    doOpen(newVal) {
      this.open = newVal;
    },
    onDown() {
      if (!this.open) {
        this.doOpen(true);
      } else {
        this.doMove(false);
      }
    },
    onUp() {
      if (this.open) {
        this.doMove(true);
      }
    },
    inputOrButtonFocus() {
      if (this.filterable) {
        this.$refs.input.focus();
      } else {
        this.$refs.button.focus();
      }
    },
    onEsc() {
      this.doOpen(false);
      this.inputOrButtonFocus();
    },
    onEnter() {
      if (this.open) {
        const options = this.filteredOptions;
        if (options.length) {
          // the options can have changed since the option was highlighted:
          // if it is no longer listed, nothing is highlighted on screen, so
          // do not pick anything, just highlight the first listed option
          if (!options.some((item) => item.value === this.dataHighlighted)) {
            this.highlighted = this.dataHighlighted;
            return;
          }
          this.onItemClick(this.highlighted);
        }
        // nothing listed: pick nothing, clear the text and close the list
        // without filterable there is no input, only the button
        this.inputOrButtonFocus();
        // clear the text only when there is one, not to emit a needless
        // filter event
        if (this.filter) {
          this.filter = "";
        }
        this.doOpen(false);
      } else {
        this.doOpen(true);
      }
    },
    onClick(ev) {
      if (this.disabled) {
        ev.preventDefault();
      } else {
        if (this.open) {
          this.inputOrButtonFocus();
          // done this way round otherwise will auto open on focus.
          this.$nextTick(() => {
            this.doOpen(false);
          });
        } else {
          this.doOpen(true);
          this.inputOrButtonFocus();
        }
      }
    },
    clearValues() {
      this.dataValue = [];
      this.inputOrButtonFocus();
      // emit a copy, not to share the array with the parent
      this.$emit("change", [...this.dataValue]);
    },
    onFocusOut(ev) {
      if (
        !this.$el.contains(ev.relatedTarget) &&
        !this.$refs.tag.$el.contains(ev.target)
      ) {
        this.doOpen(false);
      }
    },
    onMousemove(val) {
      this.highlighted = val;
    },
    onItemClick(val) {
      if (!val) {
        return;
      }

      const index = this.dataValue.findIndex((item) => val === item);
      if (index > -1) {
        this.dataValue.splice(index, 1);
      } else {
        this.dataValue.push(val);

        if (
          this.acceptUserInput &&
          !this.internalOptions.find((item) => item.value === val)
        ) {
          this.addUserInputOptions();

          this.$nextTick(() => {
            this.clearFilter();
          });
        }
      }

      this.$refs.button.focus();
      // emit a copy, not to share the array with the parent
      this.$emit("change", [...this.dataValue]);
    },
    syncValueWithOptions() {
      if (this.acceptUserInput) {
        this.addUserInputOptions();
        return;
      }
      // Without user input, every value must be an option: drop the values
      // without one, such as an option deleted in the meantime, not to send
      // them back at the next change. Not while there are no options: they
      // can arrive later than the value, as when a page loads its
      // configuration
      if (this.internalOptions.length) {
        this.dataValue = this.dataValue.filter((val) =>
          this.internalOptions.some((item) => item.value === val)
        );
      }
    },
    addUserInputOptions() {
      // list the values without an option as user input, to show their
      // label and to unselect them
      for (const val of this.dataValue) {
        if (!this.internalOptions.some((item) => item.value === val)) {
          this.internalOptions.push({
            name: val,
            label: val,
            value: val,
            type: this.userInputLabel,
          });
        }
      }
    },
    inputClick() {
      if (!this.open) {
        this.doOpen(true);
      }
    },
    inputFocus() {
      this.doOpen(true);
    },
    getItemLabel(item) {
      let label = item.label;

      if (this.showItemType && item.type) {
        label += ` [${item.type}]`;
      }

      if (this.showItemDescription && item.description) {
        label += ` ${item.description}`;
      }
      return label;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../lib-styles/tooltip";

.selected-items {
  margin-top: $spacing-03;
}

.bx--multi-select--filterable .bx--tag.selected-item {
  margin-left: 0;
  margin-bottom: 0.25rem;
}

.margin-bottom-on-open {
  margin-bottom: 14rem;
}

.label-with-tooltip {
  display: flex;
  align-items: baseline;
}
</style>

<style lang="scss">
// global styles

.selected-item button.bx--tag__close-icon {
  position: relative;
  right: 1px;
}

.ns-multi-select .bx--tooltip__label .bx--tooltip__trigger {
  margin-left: 0.25rem;
}
</style>
