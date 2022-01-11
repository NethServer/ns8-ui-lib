<template>
  <cv-tile kind="standard" :light="light" class="ns-backup-card">
    <!-- icon -->
    <div class="row">
      <NsSvg :svg="Save32" />
    </div>
    <div class="row">
      <h3 class="title">{{ title }}</h3>
    </div>
    <div v-if="loading" class="row">
      <cv-skeleton-text
        :paragraph="true"
        :line-count="5"
        class="mg-top-sm"
      ></cv-skeleton-text>
    </div>
    <template v-else-if="!backupsContainingInstance.length">
      <div class="row">
        <!-- no backup -->
        <NsInlineNotification
          kind="warning"
          :title="noBackupMessage"
          :showCloseButton="false"
          :actionLabel="scheduleBackupLabel"
          @action="goToBackup"
        />
      </div>
    </template>
    <template v-else>
      <div v-for="backup in backupsContainingInstance" :key="backup.id">
        <div class="row">
          <h5
            v-if="backupsContainingInstance.length > 1"
            class="title mg-top-sm"
          >
            {{ backup.name }}
          </h5>
        </div>
        <div class="table-wrapper">
          <div class="table">
            <!-- status -->
            <div class="tr">
              <div class="td label">{{ statusLabel }}</div>
              <div class="td status">
                <span v-if="!backup.enabled" class="ns-warning">
                  {{ backupDisabledLabel }}
                </span>
                <span
                  v-else-if="
                    status[backup.id] && status[backup.id].success == true
                  "
                  class="ns-success"
                >
                  <span>{{ statusSuccessLabel }}</span>
                </span>
                <span
                  v-else-if="
                    status[backup.id] && status[backup.id].success == false
                  "
                  class="ns-error"
                >
                  {{ statusErrorLabel }}
                </span>
                <span v-else class="ns-warning">
                  {{ statusNotRunLabel }}
                </span>
              </div>
            </div>
            <!-- repository -->
            <div class="tr">
              <div class="td label">{{ repositoryLabel }}</div>
              <div class="td">
                {{ backup.repoName }}
              </div>
            </div>
            <!-- completed -->
            <div class="tr">
              <div class="td label">{{ completedLabel }}</div>
              <div class="td">
                <span v-if="status[backup.id] && status[backup.id].end">
                  {{
                    (status[backup.id].end * 1000) | date("yyyy-MM-dd HH:mm:ss")
                  }}
                </span>
                <span v-else>-</span>
              </div>
            </div>
            <!-- duration -->
            <div class="tr">
              <div class="td label">{{ durationLabel }}</div>
              <div class="td">
                <span
                  v-if="
                    status[backup.id] &&
                    status[backup.id].end &&
                    status[backup.id].start
                  "
                >
                  {{
                    (status[backup.id].end - status[backup.id].start)
                      | secondsFormat
                  }}
                </span>
                <span v-else>-</span>
              </div>
            </div>
            <!-- total size -->
            <div class="tr">
              <div class="td label">{{ totalSizeLabel }}</div>
              <div class="td">
                <span v-if="status[backup.id] && status[backup.id].total_size">
                  {{ status[backup.id].total_size | byteFormat }}
                </span>
                <span v-else>-</span>
              </div>
            </div>
            <!-- total file count -->
            <div class="tr">
              <div class="td label">{{ totalFileCountLabel }}</div>
              <div class="td">
                <span
                  v-if="status[backup.id] && status[backup.id].total_file_count"
                >
                  {{ status[backup.id].total_file_count | humanFormat }}
                  ({{ status[backup.id].total_file_count }})
                </span>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div>
      <div class="row mg-top-sm">
        <NsButton
          kind="ghost"
          :icon="ArrowRight20"
          @click="goToBackup"
          :disabled="loading"
          >{{ goToBackupLabel }}
        </NsButton>
      </div>
    </div>
  </cv-tile>
</template>

<script>
import IconService from "../lib-mixins/icon.js";

export default {
  name: "NsBackupCard",
  mixins: [IconService],
  props: {
    title: {
      type: String,
      default: "Backup",
    },
    noBackupMessage: {
      type: String,
      default: "No backup configured",
    },
    scheduleBackupLabel: {
      type: String,
      default: "Configure",
    },
    goToBackupLabel: {
      type: String,
      default: "Go to Backup",
    },
    repositoryLabel: {
      type: String,
      default: "Repository",
    },
    statusLabel: {
      type: String,
      default: "Status",
    },
    statusSuccessLabel: {
      type: String,
      default: "Success",
    },
    statusNotRunLabel: {
      type: String,
      default: "Backup has not run yet",
    },
    statusErrorLabel: {
      type: String,
      default: "Error",
    },
    completedLabel: {
      type: String,
      default: "Completed",
    },
    durationLabel: {
      type: String,
      default: "Duration",
    },
    totalSizeLabel: {
      type: String,
      default: "Total size",
    },
    totalFileCountLabel: {
      type: String,
      default: "Total file count",
    },
    backupDisabledLabel: {
      type: String,
      default: "Disabled",
    },
    moduleId: {
      type: String,
      required: true,
    },
    moduleUiName: {
      type: String,
      default: "",
    },
    repositories: {
      type: Array,
      required: true,
    },
    backups: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    coreContext: {
      type: Object,
      required: true,
    },
    light: Boolean,
  },
  data() {
    return {
      backupsContainingInstance: [],
      status: [],
    };
  },
  watch: {
    repositories: function () {
      this.updateData();
    },
    backups: function () {
      this.updateData();
    },
  },
  created() {
    this.updateData();
  },
  methods: {
    updateData() {
      let backupsContainingInstance = [];

      for (const backup of this.backups) {
        for (const instance of backup.instances) {
          if (instance.module_id == this.moduleId) {
            backupsContainingInstance.push(backup);
          }
        }
      }
      this.backupsContainingInstance = backupsContainingInstance;

      // status
      for (const backup of this.backupsContainingInstance) {
        const instance = backup.instances.find(
          (i) => i.module_id == this.moduleId
        );
        const status = instance.status;
        this.status[backup.id] = status;
      }
    },
    goToBackup() {
      if (this.coreContext) {
        this.coreContext.$router.push("/backup");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.ns-backup-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 7rem;
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.title {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.table {
  display: table;
}

.tr {
  display: table-row;
}

.td {
  display: table-cell;
}

.label {
  padding-right: 0.75rem;
  font-weight: bold;
  text-align: right;
  padding-bottom: 0.5rem;
}

.status {
  font-weight: bold;
}

.backup-status-icon {
  margin-right: 0.25rem;
}
</style>
