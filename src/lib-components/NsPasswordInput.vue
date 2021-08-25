<template>
  <div class="ns-password-input">
    <cv-text-input
      :value="value"
      @input="onInput"
      type="password"
      :helperText="helperText"
      :invalid-message="invalidMessage"
      :label="label"
      :passwordHideLabel="passwordHideLabel"
      :passwordShowLabel="passwordShowLabel"
      :passwordVisible="passwordVisible"
      :light="light"
      class="password-input"
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
</template>

<script>
import { CvTextInput } from "@carbon/vue";

export default {
  name: "NsPasswordInput",
  components: CvTextInput,
  props: {
    value: String,
    helperText: { type: String, default: undefined },
    invalidMessage: { type: String, default: undefined },
    label: String,
    passwordHideLabel: { type: String, default: "Hide password" },
    passwordShowLabel: { type: String, default: "Show password" },
    passwordVisible: Boolean,
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
  },
  watch: {
    isLengthOk: function() {
      this.emitPasswordValidity();
    },
    isLowercaseOk: function() {
      this.emitPasswordValidity();
    },
    isUppercaseOk: function() {
      this.emitPasswordValidity();
    },
    isNumberOk: function() {
      this.emitPasswordValidity();
    },
    isSymbolOk: function() {
      this.emitPasswordValidity();
    },
  },
  methods: {
    onInput(event) {
      this.$emit("input", event);
    },
    emitPasswordValidity() {
      const isPasswordValid =
        this.isLengthOk &&
        this.isLowercaseOk &&
        this.isUppercaseOk &&
        this.isNumberOk &&
        this.isSymbolOk;
      this.$emit("passwordValidation", isPasswordValid);
    },
  },
};
</script>

<style scoped lang="scss">
.password-input {
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
