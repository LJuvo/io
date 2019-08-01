<template>
  <div class="geEditor"></div>
</template>
<script>
import Graph from "./graph/EditGraph";
import mxgraph from "./graph/index";
const {
  mxEvent,
  mxCell,
  mxUtils,
  mxCodecRegistry,
  mxGraphModel,
  mxConstants,
  mxRectangle
} = mxgraph;
export default {
  props: {},
  components: {},
  data() {
    return {
      graph: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const container = document.querySelector(".geEditor");
      const graph = (this.graph = new Graph(container));

      var parent = graph.getDefaultParent();
      graph.getModel().beginUpdate();
      try {
        var v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
        var v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
        var e1 = graph.insertEdge(parent, null, "", v1, v2);
      } finally {
        graph.getModel().endUpdate();
      }
      graph.addListener("click", this.onGraphClick);
      graph.addListener("addCells", this.onAddCells);
    },
    onGraphClick(sender, evt) {},

    onAddCells() {
      // console.log("add cells");
    }
  },
  beforeDestroy() {}
};
</script>
<style lang='less' scoped>
.geEditor {
  width: 100%;
  height: 100%;
  background: #ffffff;
  // overflow: hidden;
}
</style>