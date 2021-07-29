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
      return this.axios.get(`${this.$root.apiUrl}/tasks/cluster`, {
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
        `${window.parent.ns8.$root.apiUrl}/cluster/tasks`,
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
        `${window.parent.ns8.$root.apiUrl}/module/${moduleId}/tasks`,
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
        task.context.data &&
        task.context.data.title
      ) {
        return task.context.data.title;
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
      const taskAction = task.context.action;
      const taskOrSubtask = rootTask ? "task" : "subtask";

      switch (task.status) {
        case "aborted":
          return this.$t("task." + taskOrSubtask + "_failed", {
            action: taskAction,
          });
        case "validation-failed":
          return this.$t("task." + taskOrSubtask + "_failed_validation", {
            action: taskAction,
          });
        case "completed":
          return this.$t("task." + taskOrSubtask + "_completed", {
            action: taskAction,
          });
        case "pending":
          return this.$t("task." + taskOrSubtask + "_pending", {
            action: taskAction,
          });
        default:
          return "";
      }
    },
    createTaskErrorNotification(err, message) {
      console.error(err);
      this.$root.$emit("createTaskErrorNotification", err, message);
    },
    createTaskErrorNotificationForApp(err, message) {
      console.error(err);
      window.parent.ns8.$root.$emit(
        "createTaskErrorNotification",
        err,
        message
      );
    },
  },
};
