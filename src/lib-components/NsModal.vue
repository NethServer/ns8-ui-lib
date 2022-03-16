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
};
</script>
