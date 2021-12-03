<template>
  <div class="ns-password-input">
    <div class="new-password-container">
      <cv-text-input
        :value="value"
        @input="onInput"
        type="password"
        :helperText="newPaswordHelperText"
        :invalidMessage="newPasswordInvalidMessage"
        :label="newPasswordLabel"
        :passwordHideLabel="passwordHideLabel"
        :passwordShowLabel="passwordShowLabel"
        :passwordVisible="newPasswordVisible"
        :light="light"
        :disabled="disabled"
        class="new-password"
        ref="newPassword"
      >
      </cv-text-input>
      <div class="password-meter">
        <span
          :class="[
            'requirement',
            { 'requirement-ok': isLengthOk, 'requirement-light': light },
          ]"
          >{{ lengthLabel }}</span
        >
        <span
          :class="[
            'requirement',
            { 'requirement-ok': isLowercaseOk, 'requirement-light': light },
          ]"
          >{{ lowercaseLabel }}</span
        >
        <span
          :class="[
            'requirement',
            { 'requirement-ok': isUppercaseOk, 'requirement-light': light },
          ]"
          >{{ uppercaseLabel }}</span
        >
        <span
          :class="[
            'requirement',
            { 'requirement-ok': isNumberOk, 'requirement-light': light },
          ]"
          >{{ numberLabel }}</span
        >
        <span
          :class="[
            'requirement',
            { 'requirement-ok': isSymbolOk, 'requirement-light': light },
          ]"
          >{{ symbolLabel }}</span
        >
      </div>
    </div>
    <div class="confirm-password-container">
      <cv-text-input
        v-model="confirmPassword"
        type="password"
        :helperText="confirmPaswordHelperText"
        :invalidMessage="confirmPasswordInvalidMessage"
        :label="confirmPasswordLabel"
        :passwordHideLabel="passwordHideLabel"
        :passwordShowLabel="passwordShowLabel"
        :passwordVisible="confirmPasswordVisible"
        :light="light"
        :disabled="disabled"
        class="confirm-password"
        ref="confirmPassword"
      >
      </cv-text-input>
      <div class="password-meter">
        <span
          :class="[
            'requirement',
            { 'requirement-ok': isEqualOk, 'requirement-light': light },
          ]"
          >{{ equalLabel }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { CvTextInput } from "@carbon/vue";
import UtilService from "../lib-mixins/util.js";

export default {
  name: "NsPasswordInput",
  components: CvTextInput,
  mixins: [UtilService],
  props: {
    value: String,
    newPaswordHelperText: { type: String, default: undefined },
    confirmPaswordHelperText: { type: String, default: undefined },
    newPasswordInvalidMessage: { type: String, default: undefined },
    confirmPasswordInvalidMessage: { type: String, default: undefined },
    newPasswordLabel: { type: String, default: "New password" },
    confirmPasswordLabel: { type: String, default: "Re-enter new password" },
    passwordHideLabel: { type: String, default: "Hide password" },
    passwordShowLabel: { type: String, default: "Show password" },
    newPasswordVisible: Boolean,
    confirmPasswordVisible: Boolean,
    // set this prop to focus new password or confirm password inputs (e.g.: { element: "newPassword" })
    focus: {
      type: Object,
      default: undefined,
    },
    light: Boolean,
    minLength: {
      type: Number,
      default: 8,
    },
    lengthLabel: {
      type: String,
      default: "Long enough",
    },
    lowercaseLabel: {
      type: String,
      default: "Lowercase letter",
    },
    uppercaseLabel: {
      type: String,
      default: "Uppercase letter",
    },
    numberLabel: {
      type: String,
      default: "Number",
    },
    symbolLabel: {
      type: String,
      default: "Symbol",
    },
    equalLabel: {
      type: String,
      default: "Equal",
    },
    disabled: Boolean,
  },
  data() {
    return {
      confirmPassword: "",
    };
  },
  computed: {
    isLengthOk() {
      return this.value.length >= this.minLength;
    },
    isLowercaseOk() {
      return /[a-z]/.test(this.value);
    },
    isUppercaseOk() {
      return /[A-Z]/.test(this.value);
    },
    isNumberOk() {
      return /\d/.test(this.value);
    },
    isSymbolOk() {
      return /\W|_/.test(this.value);
    },
    isEqualOk() {
      return this.value.length && this.value === this.confirmPassword;
    },
  },
  watch: {
    isLengthOk: function () {
      this.emitPasswordValidity();
    },
    isLowercaseOk: function () {
      this.emitPasswordValidity();
    },
    isUppercaseOk: function () {
      this.emitPasswordValidity();
    },
    isNumberOk: function () {
      this.emitPasswordValidity();
    },
    isSymbolOk: function () {
      this.emitPasswordValidity();
    },
    isEqualOk: function () {
      this.emitPasswordValidity();
    },
    focus: function () {
      if (this.focus && this.focus.element) {
        this.focusElement(this.focus.element);
      }
    },
  },
  methods: {
    onInput(event) {
      this.$emit("input", event);
    },
    emitPasswordValidity() {
      const validation = {
        isLengthOk: this.isLengthOk,
        isLowercaseOk: this.isLowercaseOk,
        isUppercaseOk: this.isUppercaseOk,
        isNumberOk: this.isNumberOk,
        isSymbolOk: this.isSymbolOk,
        isEqualOk: this.isEqualOk,
        isValid:
          this.isLengthOk &&
          this.isLowercaseOk &&
          this.isUppercaseOk &&
          this.isNumberOk &&
          this.isSymbolOk &&
          this.isEqualOk,
      };
      this.$emit("passwordValidation", validation);
    },
  },
};
</script>

<style scoped lang="scss">
.new-password-container {
  margin-bottom: 1rem;
}

.new-password {
  margin-bottom: 0.25rem;
}

.confirm-password {
  margin-bottom: 0.25rem;
}

.password-meter {
  display: flex;
}

@media (min-width: 672px) {
  .password-meter {
    // same max-width as _ns8.scss for: // limit form fields width on large devices
    max-width: 38rem;
  }
}

.requirement {
  padding: 0.2rem;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
  background-color: #f4f4f4;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.34;
  letter-spacing: 0.32px;
}

.requirement-light {
  background-color: #ffffff;
}

.requirement:first-child {
  margin-left: 0;
}

.requirement-ok {
  color: white;
  background-color: #198038;
}
</style>
