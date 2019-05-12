<template>
  <div style="width:100%;height:100%;padding:20px;">
    <svg id="chart" style="width:100%;height:100%"></svg>
  </div>
</template>

<script>
import ChartObj from "../utils/SimpleBarChart";
export default {
  data() {
    return {
      chartArr: [
        { letter: "一", frequency: 0.08167 },
        { letter: "二", frequency: 0.13492 },
        { letter: "三", frequency: 0.02782 },
        { letter: "四", frequency: 0.04253 },
        { letter: "五", frequency: 0.12702 },
        { letter: "六", frequency: 0.02288 },
        { letter: "日", frequency: 0.22288 }
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
