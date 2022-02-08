# ns8-ui-lib

This library includes [Vue.js](https://vuejs.org/) UI components and mixins used by [NethServer 8](https://github.com/NethServer/ns8-core) UI.

In `src/main.js` add the following to globally include NS8 components:

```js
// main.js

import ns8Lib from "@nethserver/ns8-ui-lib";
Vue.use(ns8Lib);
```

To import a mixin inside a component (e.g. `TaskService` mixin):

```js
// ComponentName.vue

import { TaskService } from "@nethserver/ns8-ui-lib";

export default {
  name: "ComponentName",
  mixins: [TaskService],
  ...
}
```
