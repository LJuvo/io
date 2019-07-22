<template>
  <div>
    <div class="workspace"></div>
    <!-- <GraphInfoDraw
      ref="graphInfoDraw"
      @back="$emit('back')"
      @up="$emit('up')"
      @on-save="$emit('on-save', $event)"
      :graph="graph"
      :show="showInfo"
    />
    <VertexInfoDraw
      v-if="infoType ==='vertex'"
      ref="vertexInfoDraw"
      :graph="graph"
      @on-edit="onEdit"
      @on-bind="onBind"
    />
    <EdgeInfoDraw
      v-else-if="infoType ==='edge'"
      ref="edgeInfoDraw"
      :graph="graph"
      @on-edit="onEdit"
      @on-bind="onBind"
    />

    <InstanceBindDraw
      ref="instanceBindDraw"
      :graph="graph"
      :item="item"
      :hasParent="hasParent"
      @create-instance="onCreateInstance"
      @bind-success="onBindSuccess"
    />
    <InstanceKpiDraw
      ref="instanceKpiDraw"
      :graph="graph"
      @create-instance="onCreateInstance"
      @bind-success="onBindSuccess"
    />
    <InstanceEditDraw
      ref="instanceEditDraw"
      :graph="graph"
      :item="item"
      @save-success="onSaveSuccess"
    />
    <PortCmdDraw ref="portCmdDraw" :graph="graph" />-->
    <AfterCreateEdgePoptip ref="acep" :graph="graph" @add-vertex="afterEdgeAddVertex" />
    <LayerManager ref="layerManager" :graph="graph" />
  </div>
</template>

<script>
import Graph from "./core/EditGraph";
const { mxRubberband } = Graph;
// import GraphInfoDraw from "./draws/GraphInfoDraw";
// import InstanceBindDraw from "./draws/InstanceBindDraw";
// import InstanceEditDraw from "./draws/InstanceEditDraw";
// import VertexInfoDraw from "./draws/VertexInfoDraw";
// import EdgeInfoDraw from "./draws/EdgeInfoDraw";
// import InstanceKpiDraw from "./draws/InstanceKpiDraw";
// import PortCmdDraw from "./draws/PortCmdDraw";
import AfterCreateEdgePoptip from "./widgets/AfterCreateEdgePoptip";
import LayerManager from "./widgets/LayerManager";
export default {
  props: ["item"],
  components: {
    // GraphInfoDraw,
    // InstanceBindDraw,
    // InstanceEditDraw,
    // VertexInfoDraw,
    // EdgeInfoDraw,
    // InstanceKpiDraw,
    // PortCmdDraw,
    AfterCreateEdgePoptip,
    LayerManager
  },
  data() {
    return {
      graph: null,
      list: [],
      data: {},
      infoType: "graph",
      showInfo: true,
      hasParent: false
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

      //针对楼层，如果有背景图默认加载进来
      const initBgImg = _.get(this.item, "base_svg", null);
      if (initBgImg) {
        const img = initBgImg.split("|")[1];
        this.$nextTick(() => graph.setBgImg(img));
      }

      // var xml =
      //   "<root><mxCell id='22' value='Hell88o,' vertex='1'><mxGeometry x='280' y='230' width='80' height='30' as='geometry'/></mxCell><mxCell id='23' value='World!00' vertex='1'><mxGeometry x='100' y='350' width='80' height='30' as='geometry'/></mxCell><mxCell id='24' value='1236546' edge='1' source='2' target='3'><mxGeometry relative='1' as='geometry'/></mxCell></root>";
      var xml =
        "<mxCell id='22' value='Hell88o,' vertex='1'><mxGeometry x='180' y='130' width='80' height='30' as='geometry'/></mxCell><mxCell id='23' value='World!00' vertex='1'><mxGeometry x='100' y='350' width='80' height='30' as='geometry'/></mxCell><mxCell id='24' value='1236546' edge='1' source='2' target='3'><mxGeometry relative='1' as='geometry'/></mxCell>";

      this.graph.loadXML(xml);
      var parent = graph.getDefaultParent();

      // Adds cells to the model in a single step
      graph.getModel().beginUpdate();
      try {
        var v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
        var v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
        var e1 = graph.insertEdge(parent, null, "", v1, v2);

        //预览时鼠标悬浮到节点时，改变鼠标样式
        graph.getCursorForCell = function(cell) {
          if (cell != null && cell.value != null && cell.vertex == 1) {
            return "pointer";
          }
        };
      } finally {
        // Updates the display
        graph.getModel().endUpdate();
      }

      graph.addListener("click", this.onGraphClick);

      graph.addListener("addCells", this.onAddCells);

      // //实例绑定
      // graph.addListener("bindResourceInstance", this.onBindResourceInstance);
      // //设置指标
      // graph.addListener("setKpi", this.onSetKpi);
      // //下钻
      // graph.addListener("drillCell", this.onDrill);
      // //端子层
      // graph.addListener("openPortLayer", this.onOpenPortLayer);
    },

    initData(v) {
      this.data = v;
      this.$refs.graphInfoDraw.init(v);
      this.graph.loadXML(v.fileData);

      //如果有父级，需要过滤父资源类的组成关系
      if (v.parentId && v.resourceClassId) {
        this.hasParent = true;
        // this.fetchRelationResClasses(v.resourceClassId);
      } else {
        this.hasParent = false;
      }
    },

    setReuseClasss(relateReuses) {
      this.$refs.instanceBindDraw.setReuseClasss(relateReuses);
    },

    expandAttributePanel(v) {
      this.showInfo = v;
    },

    toggleLayer() {
      this.$refs.layerManager.toggle();
    },

    onAddCells(sender, evt) {
      console.log("on add cell->");
      //假如不是默认层则不响应
      if (!this.graph.isDefaultLayerShow()) {
        this.infoType = "graph";
        return;
      }

      const cell = evt.properties.cells[0];
      console.log("on add cell->", cell);
      if (cell.vertex) {
        if (cell.children) {
          //群组
        } else {
          //节点
          this.infoType = "vertex";
          this.$nextTick(() => {
            this.$refs.vertexInfoDraw.setItem(cell);
            this.graph.bindResourceInstance(cell);
          });
        }
      } else if (cell.edge) {
        //判断是否是资源类连线
        const isBizEdge = _.get(cell, "data.resourceClassId", false);
        if (isBizEdge) {
          this.infoType = "edge";
          this.$nextTick(() => {
            this.$refs.edgeInfoDraw.setItem(cell);
            this.graph.bindResourceInstance(cell);
          });
        }

        const sourceHasResClass = _.get(
          cell.source,
          "data.resourceClassId",
          false
        );

        if (sourceHasResClass && !cell.target) {
          //如果连线没有连到节点上，则添加连线后弹出选择框
          const { offsetX, offsetY } = sender.lastEvent;
          this.$refs.acep.show(cell, offsetX, offsetY);
        }
      }
    },

    onGraphClick(sender, evt) {
      const cell = evt.getProperty("cell");
      console.log("TCL: onGraphClick -> cell", cell);

      //假如不是默认层则不响应
      if (!this.graph.isDefaultLayerShow()) {
        this.infoType = "graph";
        const isPort = _.get(cell, "data.isPort", false);
      }

      if (!cell) {
        this.infoType = "graph";
        console.log("graph");
      } else if (cell.vertex) {
        this.infoType = "vertex";
        console.log("vertex");

        // this.$nextTick(() => {
        //   this.$refs.vertexInfoDraw.setItem(cell);
        // });
      } else if (cell.edge) {
        this.infoType = "edge";
        console.log("edge");
        // this.$nextTick(() => {
        //   this.$refs.edgeInfoDraw.setItem(cell);
        // });
      }
    },

    //cell绑定资源实例
    onBindResourceInstance(sender, evt) {
      const cell = evt.getProperty("cell");
      const cellData = _.get(cell, "data", {});
      this.$refs.instanceBindDraw.show(cellData);
    },

    //绑定成功后刷新信息面板
    onBindSuccess(cell) {
      if (cell.vertex) {
        this.$refs.vertexInfoDraw.setItem(cell);
      } else if (cell.edge) {
        this.$refs.edgeInfoDraw.setItem(cell);
      }
    },

    //设置指标
    onSetKpi(sender, evt) {
      const cell = evt.getProperty("cell");
      const cellData = _.get(cell, "data", {});
      this.$refs.instanceKpiDraw.show(cellData);
    },

    markAndSave() {
      //标记并保存当前拓扑
      this.$refs.graphInfoDraw.markAndSave();
    },

    onDrill(sender, evt) {
      const cell = evt.getProperty("cell");
      const cellData = _.get(cell, "data.bindData", {});
      this.$emit("drill", cellData);
      if (this.$refs.vertexInfoDraw) {
        this.$refs.vertexInfoDraw.hide();
      }
      this.infoType = "graph";
    },

    onOpenPortLayer(sender, evt) {
      this.$refs.graphInfoDraw.hideDefaultLayer();
    },

    //创建资源实例
    onCreateInstance(resClass) {
      this.$refs.instanceEditDraw.add(resClass);
    },

    //新建实例并绑定
    onSaveSuccess(v) {
      this.$refs.instanceBindDraw.saveAndBind(v);
    },

    //信息面板发出的绑定事件
    onBind(cell) {
      const cellData = _.get(cell, "data", {});
      this.$refs.instanceBindDraw.show(cellData);
    },

    onEdit(cell) {
      const cellData = _.get(cell, "data", {});
      this.$refs.instanceEditDraw.edit(cellData);
    },

    afterEdgeAddVertex(resClass) {}
  },
  beforeDestroy() {
    console.log("TCL: beforeDestroy -> beforeDestroy");
    // this.graph.destory();
  }
};
</script>
<style lang="less" scoped>
@import "../styles/workspace.less";
</style>
