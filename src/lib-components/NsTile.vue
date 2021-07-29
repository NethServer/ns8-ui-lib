<template>
  <component
    :is="tagType"
    :class="[
      `cv-tile ${carbonPrefix}--tile`,
      { [`${carbonPrefix}--tile--light`]: isLight },
      'ns-tile',
      { 'pad-bottom': icon },
    ]"
    :checked="selected"
    :expanded="expanded"
    v-bind="$attrs"
    v-on="$listeners"
    ref="tile"
  >
    <template>
      <slot></slot>
    </template>

    <!-- icon -->
    <NsSvg v-if="icon" :svg="icon" class="tile-icon" />
  </component>
</template>

<script>
import { CvTile } from "@carbon/vue";
import NsSvg from "./NsSvg";

export default {
  name: "NsTile",
  extends: CvTile,
  inheritAttrs: false,
  model: {
    // required for selectable kind
    prop: "modelValue",
    event: "modelEvent",
  },
  components: {
    NsSvg,
  },
  props: {
    // NsTile cannot be expandable
    selected: Boolean,
    kind: {
      type: String,
      default: "standard",
      validator: (value) =>
        ["clickable", "selectable", "standard"].includes(value),
    },
    icon: {
      type: [String, Object],
      default: undefined,
      validator(val) {
        if (!val || typeof val === "string") {
          return true;
        }
        return val.render !== null;
      },
    },
    light: Boolean,
  },
  computed: {
    tagType() {
      switch (this.kind) {
        case "clickable":
          return "cv-tile-clickable";
        case "selectable":
          return "cv-tile-selectable";
        default:
          return "cv-tile-standard";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tile-icon {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.pad-bottom {
  padding-bottom: 4rem;
}
</style>
