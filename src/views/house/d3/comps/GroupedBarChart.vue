<template>
  <div style="width:98%;height:98%;">
    <svg id="chart" style="width:100%;height:100%"></svg>
  </div>
</template>

<script>
import ChartObj from "../utils/GroupedBarChart";
export default {
  data() {
    return {
      chartArr: [
        { date: "2011", q1: 155, q2: 200, q3: 214, q4: 234 },
        { date: "2012", q1: 165, q2: 210, q3: 244, q4: 254 },
        { date: "2013", q1: 175, q2: 230, q3: 274, q4: 274 },
        { date: "2014", q1: 185, q2: 250, q3: 304, q4: 294 },
        { date: "2015", q1: 195, q2: 270, q3: 334, q4: 314 },
        { date: "2016", q1: 205, q2: 290, q3: 364, q4: null }
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
