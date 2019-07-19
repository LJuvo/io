<template>
  <div class="basic-pane">
    <!-- <menu-model :initarr="initArr"></menu-model> -->
    <!-- <svg-color-model></svg-color-model> -->
    <mx-graph-model></mx-graph-model>
  </div>
</template>
<script>
export default {
  components: {
    // MenuModel: () => import("./menuArr")
    // SvgColorModel: () => import("./svgChangeColor")
    MxGraphModel: () => import("./mxGraph")
  },
  data() {
    return {
      //   initArr: [
      //     { id: "sf1321dfs", label: "weefs" },
      //     { id: "df231vss", label: "fsfq" },
      //     { id: "fs23123", label: "bghds" }
      //   ]
    };
  },

  mounted() {},
  methods: {},
  beforeDestroy() {}
};
</script>
<style lang='less' scoped>
.basic-pane {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background: #ffffff;
}
</style>