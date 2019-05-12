<template>
  <div style="width:100%;height:100%;overflow:hidden;overflow-y:auto;">
    <simple-bar-chart v-if="routerModel=='default'"></simple-bar-chart>
    <simple-area-chart v-else-if="routerModel=='areachart'"></simple-area-chart>
    <simple-pie-chart v-else-if="routerModel=='piechart'"></simple-pie-chart>
    <simple-ring-chart v-else-if="routerModel=='ringchart'"></simple-ring-chart>
    <simple-line-chart v-else-if="routerModel=='linechart'"></simple-line-chart>
    <simple-lineii-chart v-else-if="routerModel=='lineIIchart'"></simple-lineii-chart>
    <simple-points-chart v-else-if="routerModel=='pointschart'"></simple-points-chart>

    <grouped-bar-chart v-else-if="routerModel=='groupedbar'"></grouped-bar-chart>
    <stacked-bar-chart v-else-if="routerModel=='stackedbar'"></stacked-bar-chart>
    <radial-stacked-bar-chart v-else-if="routerModel=='radialstackedbar'"></radial-stacked-bar-chart>
    <div v-else>暂无</div>
  </div>
</template>

<script>
import SimpleBarChart from "./comps/SimpleBarChart";
import SimpleAreaChart from "./comps/SimpleAreaChart";
import SimplePieChart from "./comps/SimplePieChart";
import SimpleRingChart from "./comps/SimpleRingChart";
import SimpleLineChart from "./comps/SimpleLineChart";
import SimpleLineiiChart from "./comps/SimpleLineIIChart";
import SimplePointsChart from "./comps/SimplePointsChart";

import GroupedBarChart from "./comps/GroupedBarChart";
import StackedBarChart from "./comps/StackedBarChart";
import RadialStackedBarChart from "./comps/RadialStackedBarChart";
export default {
  props: {
    routerModel: {
      type: String,
      default: "default"
    }
  },
  components: {
    SimpleBarChart,
    SimpleAreaChart,
    SimplePieChart,
    SimpleRingChart,
    SimpleLineChart,
    SimpleLineiiChart,
    SimplePointsChart,

    GroupedBarChart,
    StackedBarChart,
    RadialStackedBarChart
  }
};
</script>

<style>
</style>
