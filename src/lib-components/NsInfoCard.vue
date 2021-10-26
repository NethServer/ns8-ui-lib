<template>
  <cv-tile kind="standard" :light="light" class="info-card">
    <!-- icon -->
    <div v-if="icon" class="row">
      <NsSvg :svg="icon" />
    </div>
    <div class="row">
      <h3 class="title">{{ title }}</h3>
    </div>
    <div v-if="description" class="row">
      <div class="description">{{ description }}</div>
    </div>
    <div class="row slot">
      <!-- Extra content -->
      <slot></slot>
    </div>
  </cv-tile>
</template>

<script>
import NsSvg from "./NsSvg.vue";
import { CvTile } from "@carbon/vue";

export default {
  name: "NsInfoCard",
  //components added for storybook to work
  components: { NsSvg, CvTile },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: String,
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
};
</script>

<style scoped lang="scss">
.info-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 7rem;
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.title {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.description {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.slot {
  margin-top: 0.5rem;
}
</style>
