<template>
  <div class="bird">
    <div id="graphOutline" />
  </div>
</template>

<script>
import mxgraph from "../graph/index";
const { mxOutline } = mxgraph;
export default {
  data() {
    return {
      graph: null,
      outline: null
    };
  },
  methods: {
    initGraph(graph) {
      this.graph = graph;

      mxOutline.prototype.border = 6;
      this.outline = new mxOutline(
        graph,
        document.getElementById("graphOutline")
      );
      this.graph.makedraggable();
    }
  }
};
</script>

<style lang="less" scoped>
.bird {
  width: 200px;
  // height: 200px;
  // background: rgba(0, 0, 0, 0.7);
  background: #ffffff;
}
</style>

