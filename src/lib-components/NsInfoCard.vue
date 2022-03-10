<template>
  <cv-tile kind="standard" :light="light" class="info-card">
    <!-- overflow menu -->
    <slot v-if="hasMenuSlot" name="menu"></slot>
    <!-- icon -->
    <div v-if="icon" class="row">
      <NsSvg :svg="icon" />
    </div>
    <div v-if="isErrorShown" class="row">
      <NsInlineNotification
        kind="error"
        :title="errorTitle"
        :description="errorDescription"
        :showCloseButton="false"
      />
    </div>
    <div v-else-if="loading" class="row">
      <cv-skeleton-text
        :paragraph="true"
        :line-count="3"
        class="skeleton"
      ></cv-skeleton-text>
    </div>
    <template v-else>
      <div v-if="title" class="row">
        <!-- title tooltip -->
        <cv-tooltip
          v-if="titleTooltip"
          alignment="center"
          direction="bottom"
          :tip="titleTooltip"
        >
          <h3 class="title">
            {{ title }}
          </h3>
        </cv-tooltip>
        <!-- no title tooltip -->
        <h3 v-else class="title">{{ title }}</h3>
      </div>
      <div v-if="description" class="row">
        <div class="description">{{ description }}</div>
      </div>
    </template>
    <div class="row slot">
      <!-- Extra content -->
      <slot v-if="hasContentSlot" name="content"></slot>
    </div>
  </cv-tile>
</template>

<script>
import NsSvg from "./NsSvg.vue";
import NsInlineNotification from "./NsInlineNotification.vue";

export default {
  name: "NsInfoCard",
  components: { NsSvg, NsInlineNotification },
  props: {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    titleTooltip: {
      type: String,
      required: false,
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
    loading: Boolean,
    isErrorShown: false,
    errorTitle: String,
    errorDescription: String,
    light: Boolean,
  },
  computed: {
    hasMenuSlot() {
      return !!this.$slots.menu;
    },
    hasContentSlot() {
      return !!this.$slots.content;
    },
  },
};
</script>

<style scoped lang="scss">
.info-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 7rem;
  // needed for abosulute positioning of overflow menu
  position: relative;
}

.skeleton {
  margin-top: 0.5rem;
  margin-left: auto;
  margin-right: auto;
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
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.description {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.slot {
  margin-top: 0.5rem;
}
</style>
