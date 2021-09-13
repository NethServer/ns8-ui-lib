<template>
  <cv-tile kind="standard" :light="light" class="node-card">
    <!-- icon -->
    <div class="row">
      <NsSvg :svg="Chip32" />
    </div>
    <div class="row">
      <h3 class="title">{{ nodeLabel }} {{ nodeId }}</h3>
    </div>
    <div class="row">
      <cv-tag v-if="isLeader" kind="green" :label="leaderLabel"></cv-tag>
      <cv-tag v-else kind="blue" :label="workerLabel"></cv-tag>
    </div>
    <div class="table-wrapper">
      <div class="table">
        <div class="tr">
          <div class="td label">{{ cpuUsageLabel }}</div>
          <div :class="['td', { warning: cpuUsage >= cpuUsageWarningTh }]">
            {{ cpuUsage }}%
          </div>
        </div>
        <div class="tr">
          <div class="td label">
            {{ cpuLoadLabel }}
            <cv-tooltip
              alignment="center"
              direction="bottom"
              :tip="cpuLoadTooltip"
              class="info"
            >
              <Information16 />
            </cv-tooltip>
          </div>
          <div class="td">
            <span :class="{ warning: load1Min >= cpuLoadWarningTh }">{{
              load1Min
            }}</span>
            /
            <span :class="{ warning: load5Min >= cpuLoadWarningTh }">{{
              load5Min
            }}</span>
            /
            <span :class="{ warning: load15Min >= cpuLoadWarningTh }">{{
              load15Min
            }}</span>
          </div>
        </div>
        <div class="tr">
          <div class="td label">{{ memoryUsedLabel }}</div>
          <div :class="['td', { warning: memoryUsed >= memoryWarningTh }]">
            {{ memoryUsed }}%
          </div>
        </div>
        <div class="tr">
          <div class="td label">{{ swapUsedLabel }}</div>
          <div :class="['td', { warning: swapUsed >= swapWarningTh }]">
            {{ swapUsed }}%
          </div>
        </div>
        <div class="tr" v-for="(disk, index) in disksUsed" :key="index">
          <div class="td label">{{ disk.name }} {{ diskUsedLabel }}</div>
          <div :class="['td', { warning: disk.used >= diskWarningTh }]">
            {{ disk.used }}%
          </div>
        </div>
      </div>
    </div>
    <div class="row slot">
      <!-- Extra content -->
      <slot></slot>
    </div>
  </cv-tile>
</template>

<script>
import NsSvg from "./NsSvg.vue";
import { CvTile } from "@carbon/vue";
import Chip32 from "@carbon/icons-vue/es/chip/32";
import Information16 from "@carbon/icons-vue/es/information/16";

export default {
  name: "NsNodeCard",
  //components added for storybook to work
  components: { NsSvg, CvTile, Information16 },
  props: {
    nodeId: String,
    nodeLabel: {
      type: String,
      default: "Node",
    },
    isLeader: Boolean,
    leaderLabel: {
      type: String,
      default: "leader",
    },
    workerLabel: {
      type: String,
      default: "worker",
    },
    cpuUsageLabel: {
      type: String,
      default: "CPU usage",
    },
    cpuLoadLabel: {
      type: String,
      default: "CPU load",
    },
    cpuLoadTooltip: {
      type: String,
      default: "CPU average load of last 1 / 5 / 15 minutes",
    },
    memoryUsedLabel: {
      type: String,
      default: "Memory used",
    },
    swapUsedLabel: {
      type: String,
      default: "Swap used",
    },
    diskUsedLabel: {
      type: String,
      default: "used",
    },
    cpuUsage: Number,
    cpuUsageWarningTh: {
      type: Number,
      default: 80,
    },
    load1Min: Number,
    load5Min: Number,
    load15Min: Number,
    cpuLoadWarningTh: {
      type: Number,
      default: 1,
    },
    memoryUsed: Number,
    memoryWarningTh: {
      type: Number,
      default: 80,
    },
    swapUsed: Number,
    swapWarningTh: {
      type: Number,
      default: 80,
    },
    disksUsed: Array,
    diskWarningTh: {
      type: Number,
      default: 80,
    },
    light: Boolean,
  },
  data() {
    return {
      Chip32,
    };
  },
};
</script>

<style scoped lang="scss">
.node-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 7rem;
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.label {
  padding-right: 0.5rem;
  font-weight: bold;
  text-align: right;
  padding-bottom: 0.5rem;
}

.slot {
  margin-top: 0.5rem;
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
</style>
