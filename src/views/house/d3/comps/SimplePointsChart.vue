<template>
  <div style="width:98%;height:98%;">
    <svg id="chart" style="width:100%;height:100%"></svg>
  </div>
</template>

<script>
import ChartObj from "../utils/SimplePointsChart";
export default {
  data() {
    return {
      chartArr: [
        [5, 66],
        [7, 55],
        [4, 99],
        [11, 78],
        [28, 65],
        [7, 88],
        [5, 56],
        [2, 60],
        [4, 57],
        [6, 98],
        [27, 33],
        [26, 77],
        [23, 95],
        [34, 87],
        [7, 68],
        [1, 68],
        [2, 60],
        [22, 84],
        [6, 96],
        [13, 87]
      ]
    };
  },
  mounted() {
    let m = new ChartObj();
    m.init("chart", this.chartArr);
  }
};
</script>

<style>
</style>
