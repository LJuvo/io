<template>
  <div class="work-wrapper">
    <div class="workspace"></div>
  </div>
</template>

<script>
import Graph from "../graph/EditGraph";
import mxgraph from "../graph/index";
import DrawImgModel from "./drawimg";
const {
  mxEvent,
  mxCell,
  mxUtils,
  mxCodecRegistry,
  mxGraphModel,
  mxConstants,
  mxRectangle
} = mxgraph;
import * as d3 from "d3";
export default {
  components: { DrawImgModel },
  data() {
    return {
      graph: null,

      pointArr: [],
      pointCell: [],

      createState: true,
      firstCell: null,
      checkedCell: {}
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getGraph() {
      return this.graph;
    },
    init() {
      const container = document.querySelector(".workspace");
      const graph = (this.graph = new Graph(container));

      // this.$nextTick(() => graph.setBgImg("imgs/25F.svg"));
      graph.view.setScale(0.15);

      graph.addListener("click", this.onGraphClick);

      graph.addListener("addCells", this.onAddCells);
    },
    onGraphClick(sender, evt) {
      console.log("on graph click ->");
    },

    onAddCells() {
      console.log("add cells");
    }
  }
};
</script>

<style lang="less" scoped>
.work-wrapper {
  width: 100%;
  height: calc(100vh - 90px);
  // padding: 20px;
  overflow: auto;
  background: #efefef;
}
.workspace {
  width: 100%;
  height: 100%;
  // border: 1px solid #efefef;
  background: #efefef;
  // background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQgTCAxNiA0IE0gNCAwIEwgNCAxNiBNIDAgOCBMIDE2IDggTSA4IDAgTCA4IDE2IE0gMCAxMiBMIDE2IDEyIE0gMTIgMCBMIDEyIDE2IiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTSAxNiAwIEwgMCAwIDAgMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+");
  touch-action: none;
}
.work-btn {
  position: absolute;
  top: 0;
  left: 0;
}
.point {
  &-btn {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 20px;
    background: #cccccc;
  }
  &-active {
    background: #48ff00;
  }
}
.work-property {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
}
</style>

