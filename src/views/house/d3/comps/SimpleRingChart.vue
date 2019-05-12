<template>
  <div style="width:98%;height:98%;">
    <svg id="chart" style="width:100%;height:100%"></svg>
  </div>
</template>

<script>
import ChartObj from "../utils/SimpleRingChart";
export default {
  data() {
    return {
      chartArr: [
        { age: "<5", population: 2704659 },
        { age: "5-13", population: 4499890 },
        { age: "14-17", population: 2159981 },
        { age: "18-24", population: 3853788 },
        { age: "25-44", population: 14106543 },
        { age: "45-64", population: 8819342 },
        { age: "≥65", population: 612463 }
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
