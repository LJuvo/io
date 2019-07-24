<template>
  <div class="bar">
    <div class="bar-add">
      <div class="bar-add-btn">
        <Icon size="30" type="ios-add" @click="createAddTool" />
      </div>
    </div>
    <!-- <div class="bar-list">
      <div class="bar-list-title">元素</div>
      <div class="bar-list-pane">
        <div
          class="bar-list-pane-item"
          v-for="(item,key) in iconList"
          :key="key"
          v-bind="{width:  64,
                 height:  64, 
                 type: 'vertex', 
                 isRegion: '地域',
                 img: item.url, 
                 label: item.label, 
                 keyName: 'keyName', 
                 tableName: 'storageTableName', 
                 resourceClassId: '1002'}"
        >
          <img ref="dragImg" :src="item.url" />
        </div>
      </div>
    </div>
    <div class="bar-list">
      <div id="imgBox"></div>
    </div>-->
  </div>
</template>

<script>
import Graph from "../graph/index";
const {
  mxToolbar,
  mxCell,
  mxGeometry,
  mxEvent,
  mxUtils,
  mxConstants,
  mxPerimeter
} = Graph;
export default {
  data() {
    return {
      graph: null,
      toolbar: null,
      iconList: [
        // { label: "bale0", url: "cuse/0.png" },
        // { label: "bale1", url: "cuse/1.png" },
        // { label: "bale2", url: "cuse/2.png" },
        // { label: "bale3", url: "cuse/3.png" },
        // { label: "bale4", url: "cuse/4.png" },
        // { label: "bale5", url: "cuse/5.png" },
        // { label: "bale6", url: "cuse/6.png" },
        // { label: "bale7", url: "cuse/7.png" }
        { label: "bale0", url: "imgs/graph/feng.svg" },
        { label: "bale1", url: "imgs/graph/feng.svg" },
        { label: "bale2", url: "imgs/graph/feng.svg" },
        { label: "bale3", url: "imgs/graph/feng.svg" },
        { label: "bale4", url: "imgs/graph/feng.svg" },
        { label: "bale5", url: "imgs/graph/feng.svg" },
        { label: "bale6", url: "imgs/graph/feng.svg" },
        { label: "bale7", url: "imgs/graph/feng.svg" },
        { label: "bale8", url: "imgs/graph/feng.svg" }
      ],
      imgList: [
        // { label: "bale0", url: "cuse/0.png" },
        // { label: "bale1", url: "cuse/1.png" },
        // { label: "bale2", url: "cuse/2.png" },
        // { label: "bale3", url: "cuse/3.png" },
        // { label: "bale4", url: "cuse/4.png" },
        // { label: "bale5", url: "cuse/5.png" },
        // { label: "bale6", url: "cuse/6.png" },
        // { label: "bale7", url: "cuse/7.png" }
        { label: "bale6", url: "imgs/toolbar/back.svg" },
        { label: "bale6", url: "imgs/toolbar/bgimg.svg" },
        { label: "bale6", url: "imgs/toolbar/clear.svg" },
        { label: "bale6", url: "imgs/toolbar/draw.svg" },
        { label: "bale6", url: "imgs/toolbar/help.svg" },
        { label: "bale6", url: "imgs/toolbar/move.svg" }
      ]
    };
  },
  mounted() {},
  methods: {
    initGraph(graph) {
      this.graph = graph;
      this.graph.makedraggable();

      var tbContainer = document.createElement("div");
      document.querySelector(".bar").appendChild(tbContainer);
      this.toolbar = new mxToolbar(tbContainer);
      this.toolbar.enabled = false;

      this.addVertex("imgs/graph/feng.svg", 100, 40, "");
      this.addVertex("imgs/graph/feng.svg", 100, 40, "shape=rounded");
      this.addVertex("imgs/graph/feng.svg", 40, 40, "shape=ellipse");
      this.addVertex("imgs/graph/feng.svg", 40, 40, "shape=rhombus");
      this.addVertex("imgs/graph/feng.svg", 40, 40, "shape=triangle");
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
    createAddTool() {
      let _this = this;

      if (!_this.graph.isSelectionEmpty()) {
        var cells = _this.graph.getSelectionCells();
        var bounds = _this.graph.getView().getBounds(cells);

        var funct = function(graph, evt, cell) {
          graph.stopEditing(false);

          var pt = graph.getPointForEvent(evt);
          var dx = pt.x - bounds.x;
          var dy = pt.y - bounds.y;

          graph.setSelectionCells(graph.importCells(cells, dx, dy, cell));
        };

        var img = _this.toolbar.addMode(null, "imgs/graph/cylinder.gif", funct);
        mxUtils.makeDraggable(img, _this.graph, funct);
      }
    },
    addVertex(icon, w, h, style) {
      var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
      vertex.setVertex(true);

      var img = this.addToolbarItem(this.graph, this.toolbar, vertex, icon);
      img.enabled = true;
      img.connectable = true;

      // this.graph.getSelectionModel().addListener(mxEvent.CHANGE, function() {
      //   var tmp = this.graph.isSelectionEmpty();
      //   mxUtils.setOpacity(img, tmp ? 100 : 20);
      //   img.enabled = tmp;
      // });
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
    }
  }
};
</script>

<style lang="less" scoped>
.bar {
  width: 100%;
  height: 100%;
  &-add {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #efefef;
    &-btn {
      padding: 5px 20px;
      border-radius: 50px;
      background: #efefef;
    }
  }
  &-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    &-title {
      font-size: 16px;
      font-weight: 600;
      padding: 10px;
    }
    &-pane {
      width: 100%;
      padding: 10px;
      display: grid;
      grid-template-columns: 20% 20% 20% 20% 20%;
      &-item {
        padding: 10px;
        width: 100%;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>

