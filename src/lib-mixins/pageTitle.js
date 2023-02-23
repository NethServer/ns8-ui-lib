function getPageTitle(vm) {
  const { pageTitle } = vm.$options;

  if (pageTitle) {
    return typeof pageTitle === "function" ? pageTitle.call(vm) : pageTitle;
  }
}

export default {
  name: "PageTitleService",
  created() {
    let pageTitle = getPageTitle(this);
    if (pageTitle) {
      if (pageTitle.includes(".title")) {
        // fallback title: i18n has not been loaded yet
        pageTitle = window.parent.CONFIG.PRODUCT_NAME
      }
      // window.document would be ok for core, but with window.parent.document we support external apps too (window.parent == window, if it's the root window)
      window.parent.document.title = pageTitle;
    }
  },
};
