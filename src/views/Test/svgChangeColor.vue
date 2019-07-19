<template>
  <div id="svgBox" class="width:100%;height:100%;"></div>
</template>

<script>
import * as d3 from "d3";
import { setTimeout, setInterval } from "timers";
export default {
  data() {
    return {
      svgPath: "images/empty.svg"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      d3.svg(this.svgPath).then(result => {
        document.getElementById("svgBox").appendChild(result.documentElement);

        this.getAllStyles();
      });
    },
    getAllStyles() {
      let svg = d3
        .select("#svgBox")
        .select("svg")
        .attr("width", "300px")
        .attr("height", "300px")
        .attr("fill", "#0cbabd");

      svg.selectAll("style").remove();

      setInterval(() => {
        svg.attr(
          "fill",
          "#0cb" + _.random(0, 9) + _.random(0, 9) + _.random(0, 9)
        );
      }, 2000);
      //   console.log(svg);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
