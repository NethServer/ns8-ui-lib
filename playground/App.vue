<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<template>
  <div class="playground">
    <h1 class="title">ns8-ui-lib playground</h1>
    <p class="description">
      A local app to quickly test library components, e.g. to reproduce a bug or
      to try several components together. Unlike Storybook, v-model and other
      Vue instance features fully work here. Edit
      <code>playground/App.vue</code> for your tests, but do not commit your
      changes.
    </p>
    <!-- add components below -->
    <NsTextInput v-model="name" label="Name" class="name-input" light />
    <NsButton kind="primary" @click="greeting = `Hello, ${name}!`">
      Greet
    </NsButton>
    <p v-if="greeting" class="greeting">{{ greeting }}</p>
  </div>
</template>

<script>
export default {
  name: "PlaygroundApp",
  data() {
    return {
      name: "",
      greeting: "",
    };
  },
};
</script>

<style scoped lang="scss">
.playground {
  max-width: 48rem;
  padding: 2rem;
}

.title {
  margin-bottom: 1rem;
}

.description {
  margin-bottom: 2rem;
}

.name-input {
  margin-bottom: 1.5rem;
}

.greeting {
  margin-top: 1rem;
}
</style>
