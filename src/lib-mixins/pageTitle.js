function getPageTitle(vm) {
  const { pageTitle } = vm.$options;

  if (pageTitle) {
    return typeof pageTitle === "function" ? pageTitle.call(vm) : pageTitle;
  }
}

export default {
  name: "PageTitleService",
  created() {
    const pageTitle = getPageTitle(this);
    if (pageTitle) {
      // window.document would be ok for core, but with window.parent.document we support external apps too (window.parent == window, if it's the root window)
      window.parent.document.title = pageTitle;
    }
  },
};
