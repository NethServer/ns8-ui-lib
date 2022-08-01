import ErrorFilled16 from "@carbon/icons-vue/es/error--filled/16";
import CheckmarkFilled16 from "@carbon/icons-vue/es/checkmark--filled/16";
import WarningFilled16 from "@carbon/icons-vue/es/warning--filled/16";
import InformationFilled16 from "@carbon/icons-vue/es/information--filled/16";
import UtilService from "./util.js";
import StorageService from "./storage.js";

export default {
  name: "TaskService",
  mixins: [StorageService, UtilService],
  methods: {
    getTaskContext(taskPath) {
      const token = this.getFromStorage("loginInfo")
        ? this.getFromStorage("loginInfo").token
        : "";
      return this.axios.get(`${this.$root.apiUrl}/${taskPath}/context`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    getTaskStatus(taskPath) {
      const token = this.getFromStorage("loginInfo")
        ? this.getFromStorage("loginInfo").token
        : "";
      return this.axios.get(`${this.$root.apiUrl}/${taskPath}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    getClusterTasks() {
      const token = this.getFromStorage("loginInfo")
        ? this.getFromStorage("loginInfo").token
        : "";
      return this.axios.get(`${this.$root.apiUrl}/cluster/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    createClusterTask(taskData) {
      const token = this.getFromStorage("loginInfo")
        ? this.getFromStorage("loginInfo").token
        : "";
      return this.axios.post(`${this.$root.apiUrl}/cluster/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    createClusterTaskForApp(taskData) {
      const token = this.getFromStorage("loginInfo")
        ? this.getFromStorage("loginInfo").token
        : "";
      return this.axios.post(
        `${window.parent.core.$root.apiUrl}/cluster/tasks`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    createModuleTaskForApp(moduleId, taskData) {
      const token = this.getFromStorage("loginInfo")
        ? this.getFromStorage("loginInfo").token
        : "";
      return this.axios.post(
        `${window.parent.core.$root.apiUrl}/module/${moduleId}/tasks`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    createNodeTask(nodeId, taskData) {
      const token = this.getFromStorage("loginInfo")
        ? this.getFromStorage("loginInfo").token
        : "";
      return this.axios.post(
        `${this.$root.apiUrl}/node/${nodeId}/tasks`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getTaskTitle(task) {
      if (
        task &&
        task.context &&
        task.context.extra &&
        task.context.extra.title
      ) {
        return task.context.extra.title;
      } else {
        return "";
      }
    },
    getTaskKind(task) {
      switch (task.status) {
        case "aborted":
        case "validation-failed":
          return "error";
        case "completed":
          return "success";
        case "pending":
          return "warning";
        default:
          return "info";
      }
    },
    getTaskIcon(task) {
      switch (task.status) {
        case "aborted":
        case "validation-failed":
          return ErrorFilled16;
        case "completed":
          return CheckmarkFilled16;
        case "pending":
          return WarningFilled16;
        default:
          return InformationFilled16;
      }
    },
    getTaskStatusDescription(task, rootTask = true) {
      let taskLabel = task.context.action;

      // use taskName instead of action, if available
      if (task.context.extra && task.context.extra.taskName) {
        taskLabel = task.context.extra.taskName;
      }

      const taskOrSubtask = rootTask ? "task" : "subtask";
      let taskPrefix = "";

      if (task.result && task.result.file) {
        taskPrefix = task.result.file.split("task/")[0];
      }
      taskLabel = taskPrefix + taskLabel;

      switch (task.status) {
        case "aborted":
          return this.$t("task." + taskOrSubtask + "_failed", {
            task: taskLabel,
          });
        case "validation-failed":
          return this.$t("task." + taskOrSubtask + "_failed_validation", {
            task: taskLabel,
          });
        case "completed":
          return this.$t("task." + taskOrSubtask + "_completed", {
            task: taskLabel,
          });
        case "pending":
          return this.$t("task." + taskOrSubtask + "_pending", {
            task: taskLabel,
          });
        case "running":
          return this.$t("task." + taskOrSubtask + "_running", {
            task: taskLabel,
          });
        default:
          return "";
      }
    },
    createErrorNotification(err, message) {
      console.error(err);
      this.$root.$emit("createErrorNotification", err, message);
    },
    createErrorNotificationForApp(err, message) {
      console.error(err);
      window.parent.core.$root.$emit("createErrorNotification", err, message);
    },
    createNotificationForApp(notification) {
      window.parent.core.$root.$emit("createNotificationForApp", notification);
    },
    deleteNotificationForApp(notification) {
      window.parent.core.$root.$emit("deleteNotificationForApp", notification);
    },
  },
};
