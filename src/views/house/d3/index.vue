<template>
  <div style="width:100%;height:100%;overflow:hidden;overflow-y:auto;">
    <simple-bar-chart v-if="routerModel=='default'"></simple-bar-chart>
    <simple-area-chart v-else-if="routerModel=='areachart'"></simple-area-chart>
    <div v-else>暂无</div>
  </div>
</template>

<script>
import SimpleBarChart from "./comps/SimpleBarChart";
import SimpleAreaChart from "./comps/SimpleAreaChart";
export default {
  props: {
    routerModel: {
      type: String,
      default: "default"
    }
  },
  components: { SimpleBarChart, SimpleAreaChart }
};
</script>

<style>
</style>
