<template>
  <div class="basic-pane">
    <div class="basic-pane-left bar"></div>
    <div class="basic-pane-center">
      <div class="workspace"></div>
    </div>
    <div class="basic-pane-right">
      <div class="nature">
        <div class="nature-title">图层</div>
        <div class="nature-content">
          <div
            class="nature-content-item"
            v-for="(item,key) in layerArr"
            :key="key"
            @click="onClickLayer(key)"
          >{{item.label}}</div>
        </div>
      </div>
      <div class="nature">
        <div class="nature-title">缩放</div>
        <div class="nature-content">
          <Icon size="22" type="md-remove" @click="onZoomOut" />
          <span>{{spaceScale}}%</span>
          <Icon size="22" type="md-add" @click="onZoomIn" />
        </div>
      </div>
      <div class="nature">
        <div class="nature-title">画板尺寸</div>
        <div class="nature-content">
          <div>
            宽度
            <Input v-model="pageWidth" @on-change="onPageSizeChange" />
          </div>
          <div>
            高度
            <Input v-model="pageHeight" @on-change="onPageSizeChange" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Graph from "../editor/graph/EditGraph";

import mxgraph from "./graph/";
// import Graph from "./graph/graph";
const {
  mxOutline,
  mxUtils,
  mxConstants,
  mxConnectionHandler,
  mxImage,
  mxToolbar,
  mxDivResizer,
  mxClient,
  mxGraphModel,
  mxGraph,
  mxKeyHandler,
  mxRubberband,
  mxCell,
  mxGeometry,
  mxEvent,
  mxShape,
  mxConnectionConstraint,
  mxPoint,
  mxRectangle,
  mxRectangleShape
} = mxgraph;
export default {
  props: {},
  components: {},
  data() {
    return {
      graph: null,
      imgList: [
        { label: "bale6", url: "imgs/toolbar/back.svg" },
        { label: "bale5", url: "imgs/toolbar/bgimg.svg" },
        { label: "bale4", url: "imgs/toolbar/clear.svg" },
        { label: "bale3", url: "imgs/toolbar/draw.svg" },
        { label: "bale2", url: "imgs/toolbar/help.svg" },
        { label: "bale1", url: "imgs/toolbar/move.svg" }
      ],
      layerArr: [],
      checkedLayer: null,

      spaceScale: 100,
      pageWidth: 500,
      pageHeight: 800
    };
  },
  mounted() {
    const container = document.querySelector(".workspace");
    const graph = (this.graph = new Graph(container));
    this.$nextTick(() => graph.setBgImg("imgs/25F.svg"));

    var parent = graph.getDefaultParent();
    console.log(parent, graph);

    this.initLayer(parent, graph);
    this.initNav();
  },
  methods: {
    initLayer(parent, graph) {
      var layer0 = parent.insert(new mxCell());
      var layer1 = parent.insert(new mxCell());
      this.layerArr = [
        { label: "layer00", cell: layer0 },
        { label: "layer01", cell: layer1 }
      ];

      var v1 = graph.insertVertex(
        layer1,
        null,
        "Hello,",
        20,
        20,
        80,
        30,
        "fillColor=#C0C0C0"
      );
      var v2 = graph.insertVertex(
        layer1,
        null,
        "Hello12",
        200,
        20,
        80,
        30,
        "fillColor=#C0C0C0"
      );
      var v3 = graph.insertVertex(layer0, null, "World!", 110, 150, 80, 30);
    },
    onClickLayer(index) {
      // let parent = this.graph.model;
      // parent.setVisible(cellLayer, !parent.isVisible(cellLayer));

      let cellLayer = this.layerArr[index].cell;
      let parent = this.graph.model;
      // let parent = this.graph.getDefaultParent();
      // console.log(parent.isVisible(cellLayer), parent.isVisible(cellLayer));
      // parent.setVisible(cellLayer, !parent.isVisible(cellLayer));

      // this.checkedLayer = cellLayer;
      let cells = this.graph.getDefaultParent().children;
      // console.log(cellLayer, parent, parent.isVisible(cellLayer), cells);
      cells.forEach(cell => {
        //   //   // console.log(cell.mxObjectId, cellLayer.mxObjectId);
        if (cell.mxObjectId == cellLayer.mxObjectId) {
          //     //     parent.setVisible(cell, !parent.isVisible(cell));
          // console.log(parent.isVisible(cellLayer));
          parent.setVisible(cell, !parent.isVisible(cell));

          this.graph.getDefaultParent().children.forEach(cell => {
            if (cell.mxObjectId == cellLayer.mxObjectId) {
              this.layerArr[index].cell = cell;
            }
          });
        }
      });
    },
    initNav() {
      this.graph.makedraggable();

      var tbContainer = document.createElement("div");
      document.querySelector(".bar").appendChild(tbContainer);
      this.toolbar = new mxToolbar(tbContainer);
      this.toolbar.enabled = false;

      this.addVertex(
        "imgs/graph/actor.gif",
        40,
        40,
        "shape=image;image=imgs/graph/actor.gif;"
      );

      this.imgList.forEach(ele => {
        this.addVertex(ele.url, 100, 100, "shape=image;image=" + ele.url + ";");
      });
    },
    addVertex(icon, w, h, style) {
      var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
      vertex.setVertex(true);

      var img = this.addToolbarItem(this.graph, this.toolbar, vertex, icon);
      img.enabled = true;
      img.connectable = true;
    },
    addToolbarItem(graph, toolbar, prototype, image) {
      var funct = function(graph, evt, cell, x, y) {
        graph.stopEditing(false);

        var vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = x;
        vertex.geometry.y = y;

        graph.addCell(vertex);
        graph.setSelectionCell(vertex);
      };

      // Creates the image which is used as the drag icon (preview)
      var img = toolbar.addMode(null, image, function(evt, cell) {
        var pt = this.graph.getPointForEvent(evt);
        funct(graph, evt, cell, pt.x, pt.y);
      });

      mxEvent.addListener(img, "mousedown", function(evt) {
        if (img.enabled == false) {
          mxEvent.consume(evt);
        }
      });

      mxUtils.makeDraggable(img, graph, funct);

      return img;
    },
    onPageSizeChange() {
      var pw = parseFloat(this.pageWidth);
      var ph = parseFloat(this.pageHeight);

      if (!isNaN(pw) && !isNaN(ph)) {
        this.graph.pageFormat = new mxRectangle(0, 0, pw, ph);
        // this.graph.scrollTileSize = new mxRectangle(0, 0, pw, ph);

        // this.graph.view.backgroundPageShape = new mxRectangleShape(
        //   this.graph.pageFormat,
        //   "#ffffff",
        //   this.graph.defaultPageBorderColor
        // );
      }

      this.graph.pageBreaksVisible = false;
      this.graph.pageBreaksVisible = true;
      this.graph.sizeDidChange();
    },
    onZoomIn() {
      this.graph.zoomIn();
      this.spaceScale = parseInt(this.graph.view.scale * 100);
    },
    onZoomOut() {
      this.graph.zoomOut();
      this.spaceScale = parseInt(this.graph.view.scale * 100);
    }
  }
};
</script>
<style lang='less' scoped>
.basic-pane {
  width: 100%;
  height: 100%;
  // background: #ffffff;
  display: grid;
  grid-template-columns: 20% auto 20%;
  &-left {
    // display: grid;
    // grid-template-columns: 20% 20% 20% 20% 20%;
    background: #ffffff;
    box-shadow: 3px -2px 10px rgba(201, 201, 201, 0.349019607843137);
  }
  &-center {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  &-right {
    background: #ffffff;
    box-shadow: 3px 2px 10px rgba(201, 201, 201, 0.349019607843137);
  }
}
.workspace {
  width: 100%;
  height: 100%;
}
.nature {
  &-title {
    padding: 10px;
    font-size: 16px;
    background: #efefef;
  }
  &-content {
    &-item {
      padding: 5px;
      background: #ffffff;
      border-bottom: 1px solid #efefef;
    }
  }
}
</style>