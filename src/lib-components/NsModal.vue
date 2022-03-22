<script>
import { CvModal } from "@carbon/vue";

export default {
  name: "NsModal",
  extends: CvModal,
  props: {
    hideOnClickOutside: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onExternalClick(ev) {
      if (this.hideOnClickOutside) {
        if (ev.target === this.$el) {
          this._maybeHide(ev, "external-click");
        }
      }
    },
  },
  focusBeforeContent() {
    this.$nextTick(() => {
      if (this.$slots["primary-button"] && !this.primaryButtonDisabled) {
        this.$refs.primary.$el.focus();
      } else if (this.$slots["secondary-button"]) {
        this.$refs.secondary.$el.focus();
      } else if (this.$slots["other-button"]) {
        this.$refs.otherBtn.$el.focus();
      } else {
        this.$refs.close.focus();
      }
    });
  },
};
</script>
