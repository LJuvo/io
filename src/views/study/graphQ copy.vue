<template>
  <div class="basic-pane">
    test
    <div class="graphbox"></div>
  </div>
</template>
<script>
import mxgraph from "./graph/";
import Graph from "./graph/graph";
const { mxOutline, mxUtils, mxConstants, mxEditor } = mxgraph;
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  mounted() {
    const container = document.querySelector(".graphbox");
    var graph = new Graph(container);
    var parent = graph.getDefaultParent();
    // Adds cells to the model in a single step

    // var config = mxUtils
    //   .load("./graph/xml/keyhandler-commons.xml")
    //   .getDocumentElement();
    // var editor = new mxEditor(config);
    // graph.loadXML("./graph/xml/keyhandler-commons.xml");
    graph.getModel().beginUpdate();
    try {
      //   let v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
      //   let v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
      //   let v3 = graph.insertVertex(parent, null, "World!", 20, 150, 180, 30);
      //   graph.insertEdge(parent, "", "", v1, v2, v3);
      //参数：节点显示的内容、X、Y、宽度、高度，X、Y是相对于DOM节点中的位置
      var v1 = graph.insertVertex(
        parent,
        null,
        "节点一",
        20,
        100,
        300,
        145,
        "rounded;strokeColor=none;fillColor=none;"
      );
      var v2 = graph.insertVertex(
        parent,
        null,
        "节点二",
        20,
        400,
        300,
        145,
        "rounded;strokeColor=none;fillColor=none;"
      ); //圆形节点
      var v3 = graph.insertVertex(
        parent,
        null,
        "B",
        80,
        100,
        100,
        100,
        "shape=ellipse;perimeter=ellipsePerimeter"
      ); //三角形节点
      var v4 = graph.insertVertex(
        parent,
        null,
        "C",
        190,
        30,
        100,
        60,
        "shape=triangle;perimeter=trianglePerimeter;direction=south"
      ); //节点是否可以折叠
      graph.getModel().setCollapsed(v2, 1);
      var html = "<div>html</div>"; //更新节点显示的内容
      graph.getModel().setValue(v1, html); //连接线，连接线上显示的内容，连接的两个节点，连接线的样式
      var e1 = graph.insertEdge(
        parent,
        null,
        "我1连2",
        v1,
        v2,
        "strokeWidth=3;labelBackgroundColor=white;fontStyle=1"
      ); //直角连线
      var e2 = graph.insertEdge(
        parent,
        null,
        "",
        v1,
        v2,
        "edgeStyle=orthogonalEdgeStyle;"
      ); //曲折连线
      var e2 = graph.insertEdge(
        parent,
        null,
        "",
        v3,
        v2,
        "edgeStyle=elbowEdgeStyle;elbow=horizontal;orthogonal=0;entryPerimeter=1;"
      ); //虚线连线
      //   graph.insertEdge(parent, null, null, step1, step2, "crossover");
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
  },
  methods: {}
};
</script>
<style lang='less' scoped>
.basic-pane {
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
  overflow-y: auto;
}
</style>