<template>
  <div class="work-wrapper">
    <div class="workspace"></div>
  </div>
</template>

<script>
import Graph from "../graph/EditGraph";
const { mxEvent } = Graph;
export default {
  data() {
    return {
      graph: null
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

      this.$nextTick(() => graph.setBgImg("imgs/25F.svg"));

      graph.addListener("click", this.onGraphClick);

      graph.addListener("addCells", this.onAddCells);
    },
    onGraphClick() {
      console.log("graph click");
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
  height: 100%;
  padding: 20px;
}
.workspace {
  width: 100%;
  height: 100%;
  border: 1px solid #efefef;
  background: url("./grid.gif");
}
</style>

