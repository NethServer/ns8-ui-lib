<template>
  <cv-modal
    kind="danger"
    size="default"
    :visible="isShown"
    @modal-hidden="onModalHidden"
    @primary-click="confirmDelete"
    :primary-button-disabled="name !== userInput"
  >
    <template slot="title">{{ title }}</template>
    <template slot="content">
      <NsInlineNotification
        kind="warning"
        :title="warning"
        :showCloseButton="false"
      />
      <div class="mg-bottom-md" v-html="description"></div>
      <div v-html="typeToConfirmMessage"></div>
      <cv-form @submit.prevent="confirmDelete">
        <cv-text-input
          v-model="userInput"
          class="mg-bottom-md"
          ref="userInput"
        ></cv-text-input>
      </cv-form>
    </template>
    <template slot="secondary-button">{{ cancelLabel }}</template>
    <template slot="primary-button">{{ deleteLabel }}</template>
  </cv-modal>
</template>

<script>
import UtilService from "../lib-mixins/util.js";
import IconService from "../lib-mixins/util.js";
import NsInlineNotification from "./NsInlineNotification.vue";

export default {
  name: "NsDangerDeleteModal",
  //component added for storybook to work
  components: { NsInlineNotification },
  mixins: [UtilService, IconService],
  props: {
    isShown: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Confirm deletion",
    },
    warning: {
      type: String,
      default: "Please read carefully",
    },
    description: {
      type: String,
      default:
        "Do you really want to delete this object? This action is irreversible",
    },
    typeToConfirm: {
      type: String,
      default: "",
    },
    cancelLabel: {
      type: String,
      default: "Cancel",
    },
    deleteLabel: {
      type: String,
      default: "I understand, delete",
    },
  },
  data() {
    return {
      userInput: "",
    };
  },
  computed: {
    typeToConfirmMessage() {
      if (this.typeToConfirm) {
        return this.typeToConfirm;
      } else {
        return `Type <strong>${this.name}</strong> to confirm deletion`;
      }
    },
  },
  watch: {
    isShown: function () {
      if (this.isShown) {
        setTimeout(() => {
          this.focusElement("userInput");
        }, 300);
      }
    },
  },
  methods: {
    onModalHidden() {
      this.$emit("hide");
    },
    confirmDelete() {
      if (this.name == this.userInput) {
        this.$emit("confirmDelete");
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>