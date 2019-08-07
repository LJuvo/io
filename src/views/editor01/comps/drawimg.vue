<template>
  <div>
    <div class="svgspace"></div>
    <Button @click="onChangeFill('#ff0000')">Red</Button>
    <Button @click="onChangeFill('#00ff00')">Green</Button>
    <Button @click="onChangeStroke('#ff0000')">边框颜色</Button>
    <Button @click="onChangeStrokeWidth(5)">宽度5</Button>
    <Button @click="onChangeStrokeWidth(2)">宽度2</Button>
    <Button @click="onEditFinish">结束编辑</Button>
    <div class="colorspace"></div>
  </div>
</template>

<script>
import mxgraph from "../graph/index";
const { mxCell, mxUtils } = mxgraph;
import * as d3 from "d3";
export default {
  data() {
    return {
      graph: null,

      drawState: false,
      editState: false,
      drawLayer: null,
      pointArr: [],
      firstCell: null,
      checkedCell: null
    };
  },
  methods: {
    initGraph(graph) {
      this.graph = graph;
    },
    //开启绘制
    startDraw() {
      this.colseState();
      this.drawState = true;
    },
    //开启编辑
    startEdit() {
      this.colseState();
      this.editState = true;
    },
    //关闭全部状态
    colseState() {
      this.drawState = false;
      this.editState = false;
    },
    //检查所有状态是否需执行
    checkDraw(evt) {
      const cell = evt.getProperty("cell");
      if (!cell) {
        if (this.drawState) {
          this.graph.resetView();
          let x = evt.properties.event.layerX;
          let y = evt.properties.event.layerY;
          this.pointArr.push({ x: x, y: y });
          this.onClearCreate();
        }
      } else {
        let firstMxId = _.get(this.firstCell, "mxObjectId", "");
        if (
          this.drawState &&
          cell.mxObjectId == firstMxId &&
          this.pointArr.length > 2
        )
          this.onFinishDraw();

        if (this.editState && cell.svgState) {
          this.checkedCell = cell;
          this.onEditLoadSvg(cell);
        }
      }
    },
    //清空绘制层元素并重载
    onClearCreate() {
      let parent = this.graph.getDefaultParent();
      if (!this.drawLayer) {
        this.drawLayer = parent.insert(new mxCell());

        this.drawLayer.drawState = true;
      } else {
        this.drawLayer = _.find(parent.children, { drawState: true });
        this.graph.removeCells(this.drawLayer.children);
      }

      this.firstCell = null;
      let lastCell = null;
      this.pointArr.forEach(ele => {
        let layer = this.drawLayer;
        let currentCell = this.graph.insertVertex(
          layer,
          null,
          "",
          ele.x - 2,
          ele.y - 2,
          5,
          5,
          "border-radius:10px;"
        );
        if (lastCell)
          this.graph.insertEdge(
            layer,
            null,
            "",
            lastCell,
            currentCell,
            "strokeColor=#ff0000"
          );
        lastCell = currentCell;
        if (!this.firstCell) this.firstCell = lastCell;
      });
    },
    //结束绘制
    onFinishDraw() {
      let parr = _.cloneDeep(this.pointArr);
      this.drawState = !this.drawState;

      this.onResetDrawLayer();

      let minX = _.minBy(parr, "x");
      let maxX = _.maxBy(parr, "x");
      let minY = _.minBy(parr, "y");
      let maxY = _.maxBy(parr, "y");

      parr.push(parr[0]);
      let data = this.createSvgImg(minX.x, maxX.x, minY.y, maxY.y, parr);

      let cell = this.graph.insertVertex(
        null,
        null,
        "",
        minX.x,
        minY.y,
        maxX.x - minX.x,
        maxY.y - minY.y,
        "shape=image;image=" + data + ";"
      );
      cell.svgState = true;

      this.clearPaintSpace();
    },
    //创建SVG图像
    createSvgImg(minx, maxx, miny, maxy, pointarr) {
      let svgBox = d3
        .select(".svgspace")
        .append("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("width", maxx - minx + "px")
        .attr("height", maxy - miny + "px")
        .attr("id", "basicsvg");
      let pointTxt = this.pointsArrFac(this.pointCutEmpty(pointarr));
      svgBox
        .append("g")
        .append("polygon")
        .attr("points", pointTxt)
        .attr("fill", "rgba(20,53,77,0.6)")
        .attr("stroke", "#2986b0")
        .attr("stroke-width", 1);

      let data =
        "data:image/svg+xml," +
        mxUtils.getXml(document.getElementById("basicsvg"));

      return data;
    },
    //切除SVG空白区域
    pointCutEmpty(arr) {
      let minTmpX = _.minBy(arr, "x");
      let minTmpY = _.minBy(arr, "y");
      let tmp = [];
      for (let i = 0; i < arr.length; i++) {
        tmp.push({
          x: arr[i].x - minTmpX.x,
          y: arr[i].y - minTmpY.y
        });
      }
      return tmp;
    },
    //SVG点格式化
    pointsArrFac(arr) {
      let txt = "";
      arr.forEach(ele => {
        let { x, y } = ele;
        txt += x + "," + y + " ";
      });
      return txt;
    },
    //清理绘制空间
    clearPaintSpace() {
      d3.select(".svgspace")
        .selectAll("svg")
        .remove();
      document.querySelector(".colorspace").innerHTML = "";
      this.colseState();
      this.pointArr = [];
      this.drawLayer = null;
      this.firstCell = null;
      this.checkedCell = null;
    },
    //重置绘制图层
    onResetDrawLayer() {
      if (!this.drawLayer && !this.drawState) return;
      let parent = this.graph.getDefaultParent();
      this.graph.removeCells(this.drawLayer.children);
      this.drawLayer.drawState = false;
      this.drawLayer = null;

      this.graph.refresh();
      this.clearPaintSpace();
    },
    //装载需编辑SVG图像
    onEditLoadSvg(obj) {
      document.querySelector(".colorspace").innerHTML = obj.style.match(
        /(?<=xml,).+(?=;)/
      )[0];
    },
    //改变填充色
    onChangeFill(color) {
      d3.select("#basicsvg")
        .selectAll("polygon")
        .attr("fill", color);

      this.dealChangeEvent();
    },
    //改变描边
    onChangeStroke(color, width = 1) {
      d3.select("#basicsvg")
        .selectAll("polygon")
        .attr("stroke", color)
        .attr("stroke-width", width);

      this.dealChangeEvent();
    },
    //改变描边宽度
    onChangeStrokeWidth(width) {
      d3.select("#basicsvg")
        .selectAll("polygon")
        .attr("stroke-width", width);

      this.dealChangeEvent();
    },
    //处理颜色变化
    dealChangeEvent() {
      if (!this.checkedCell) return;
      this.checkedCell.style = this.checkedCell.style.replace(
        /\<svg([\s\S]*?)\<\/svg\>/,
        document.querySelector(".colorspace").innerHTML
      );

      this.graph.refresh();
    },
    //结束编辑
    onEditFinish() {
      this.clearPaintSpace();
    },
    destory() {}
  }
};
</script>

<style>
</style>
