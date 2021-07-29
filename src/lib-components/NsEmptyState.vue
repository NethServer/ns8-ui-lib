<template>
  <div class="empty-state">
    <NsPictogram title="empty state" class="image">
      <template v-if="hasPictogramSlot">
        <slot name="pictogram"></slot>
      </template>
      <template v-else>
        <ExclamationMark />
      </template>
    </NsPictogram>
    <h5 class="title">{{ title }}</h5>

    <template v-if="hasDescriptionSlot">
      <div class="description">
        <slot name="description"></slot>
      </div>
    </template>
  </div>
</template>

<script>
import NsPictogram from "./NsPictogram.vue";
import ExclamationMark from "./pictograms/ExclamationMark";

export default {
  name: "NsEmptyState",
  components: { NsPictogram, ExclamationMark },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    hasPictogramSlot() {
      return !!this.$slots.pictogram;
    },
    hasDescriptionSlot() {
      return !!this.$slots.description;
    },
  },
};
</script>

<style scoped lang="scss">
.empty-state {
  text-align: center;
  padding: 2rem;
}

.empty-state .image {
  margin-bottom: 1rem;
}

.empty-state .description {
  margin-top: 1rem;
}
</style>
