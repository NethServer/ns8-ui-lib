<template>
  <div class="ns-menu-item">
    <span v-if="icon == 'edit'" class="icon"><Edit20 /></span>
    <span v-else-if="icon == 'trash'" class="icon"><TrashCan20 /></span>
    <span v-else-if="icon == 'power'" class="icon"><Power20 /></span>
    <span v-else-if="icon == 'rocket'" class="icon"><Rocket20 /></span>
    <span v-else-if="icon == 'launch'" class="icon"><Launch20 /></span>
    <span v-else-if="icon == 'star'" class="icon"><Star20 /></span>
    <span v-else-if="hasIconSlot" class="icon">
      <slot name="icon"></slot>
    </span>
    <span>{{ label }}</span>
  </div>
</template>

<script>
import Edit20 from "@carbon/icons-vue/es/edit/20";
import TrashCan20 from "@carbon/icons-vue/es/trash-can/20";
import Power20 from "@carbon/icons-vue/es/power/20";
import Rocket20 from "@carbon/icons-vue/es/rocket/20";
import Launch20 from "@carbon/icons-vue/es/launch/20";
import Star20 from "@carbon/icons-vue/es/star/20";

export default {
  name: "NsMenuItem",
  components: { Edit20, TrashCan20, Power20, Rocket20, Launch20, Star20 },
  props: {
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      validator: (value) =>
        ["", "edit", "trash", "power", "rocket", "launch", "star"].includes(
          value
        ),
    },
  },
  computed: {
    hasIconSlot() {
      return !!this.$slots.icon;
    },
  },
};
</script>

<style scoped lang="scss">
.ns-menu-item {
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 0.5rem;
}
</style>
