<template>
  <div style="width:98%;height:98%;">
    <svg id="chart" style="width:100%;height:100%"></svg>
  </div>
</template>

<script>
import ChartObj from "../utils/SimpleLineIIChart";
export default {
  data() {
    return {
      chartArr: [
        { time: "00:00", pm25: 75 },
        { time: "01:00", pm25: 66 },
        { time: "02:00", pm25: 43 },
        { time: "03:00", pm25: 32 },
        { time: "04:00", pm25: 20 },
        { time: "05:00", pm25: 18 },
        { time: "06:00", pm25: 16 },
        { time: "07:00", pm25: 33 },
        { time: "08:00", pm25: 53 },
        { time: "09:00", pm25: 66 },
        { time: "10:00", pm25: 55 },
        { time: "11:00", pm25: 67 },
        { time: "12:00", pm25: 99 },
        { time: "13:00", pm25: 138 },
        { time: "14:00", pm25: 110 },
        { time: "15:00", pm25: 99 },
        { time: "16:00", pm25: 119 },
        { time: "17:00", pm25: 125 },
        { time: "18:00", pm25: 173 },
        { time: "19:00", pm25: 168 },
        { time: "20:00", pm25: 162 },
        { time: "21:00", pm25: 143 },
        { time: "22:00", pm25: 132 },
        { time: "23:00", pm25: 87 }
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
