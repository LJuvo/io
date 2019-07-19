<template>
  <div>
    <div class="outline-wrapper">
      <label style="padding: 4px 8px;">鸟瞰图</label>
      <div id="graphOutline" />
    </div>
  </div>
</template>

<script>
import mxgraph from "./core/index.js";
const { mxOutline } = mxgraph;
export default {
  data() {
    return {
      collapseValue: "",
      graph: null,
      list: [],
      outline: null,
      isInited: false
    };
  },
  mounted() {},
  methods: {
    initGraph(graph) {
      this.graph = graph;
      // this.initRes(null, true);
      if (!this.outline) {
        mxOutline.prototype.border = 6;
        this.outline = new mxOutline(
          graph,
          document.getElementById("graphOutline")
        );
        this.graph.makedraggable();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../styles/compNav.less";
</style>