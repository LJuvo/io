<template>
  <div style="position: relative; width:100%; height: 100%;overflow: hidden;">
    <div class="preview">
      <slot name="previewBox"></slot>
    </div>
    <div class="preview-toolbar">
      <h3 style="background: #fff;padding: 2px 4px;margin: 0 auto;">{{title}}</h3>
      <div style="position: absolute; top: 12px; right: 12px;">
        <Button icon="md-arrow-up" size="small" type="primary" @click="onBack">返回上级</Button>&nbsp;&nbsp;
        <Button icon="md-create" size="small" type="primary" @click="onEdit">编辑</Button>&nbsp;&nbsp;
        <Button
          :disabled="!isTopLevel"
          icon="md-copy"
          size="small"
          type="primary"
          @click="onCopy"
        >克隆</Button>&nbsp;&nbsp;
        <Button icon="md-search" size="small" type="primary" @click="onSearch">搜索</Button>&nbsp;&nbsp;
        <Button icon="md-add" size="small" type="primary" @click="graph.zoomIn()"></Button>&nbsp;&nbsp;
        <Button icon="md-remove" size="small" type="primary" @click="graph.zoomOut()"></Button>&nbsp;&nbsp;
        <Button icon="md-copy" size="small" @click="() => this.graph.logXml()">Log</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Graph from "./comps/core/graph.js";
import mxgraph from "./comps/core/index.js";
import * as d3 from "d3";
const { mxOutline } = mxgraph;
export default {
  data() {
    return {
      graph: null,
      showCopyModal: false,
      data: {},
      item: {},
      copyToFloor: "",
      areas: [], //楼层所有区域
      lastTransform: undefined,
      showSearch: false,
      searchCells: [],
      svg: undefined
    };
  },
  // watch: {
  //   data: {
  //     handler: function(v) {
  //       this.loadData(v);
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    title() {
      return this.data ? this.data.name : "未命名";
    },
    region() {
      const list = _.cloneDeep(this.$store.state.resource.region);
      return list;
    },
    isTopLevel() {
      return _.get(this.data, "parentId", "") == "";
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const container = document.querySelector(".preview");
      const graph = (this.graph = new Graph(container));

      graph.addListener("doubleClick", this.onGraphDblClick);

      // setTimeout(() => {
      //   this.mockAlarm();
      // }, 2000);
      // new mxOutline(graph, document.getElementById("preview-outline"));
    },
    initData(v, item) {
      this.data = v;
      this.item = item;
      if (item) {
        this.areas = _.filter(this.region, { parent_id: item.id });
        this.svg = d3.select(".preview").select("svg");
        // .attr("width", "100%")
        // .attr("height", "100%");
        // this.toggleZoom(true);
        // this.drawArea();
      }

      const xml = _.get(v, "fileData", "");
      this.graph.loadXML(xml);
    },
    drawArea() {
      this.areas.forEach(ele => {
        if (ele.geo.value) {
          let pointArr = JSON.parse(ele.geo.value);
          this.drawInitSpace(
            pointArr,
            this.svg.append("g").attr("class", "point")
          );
        }
      });
    },
    zoomIn() {
      this.zoom.scaleBy(this.svg, 2);
      d3.zoomTransform(this.svg.node());
    },
    zoomOut() {
      this.zoom.scaleBy(this.svg, 0.5);
      d3.zoomTransform(this.svg.node());
    },
    toggleZoom(v) {
      if (v) {
        let zoomobj = d3.zoom().scaleExtent([0.25, 4]);
        let self = this;
        this.zoom = zoomobj
          .on("zoom", function() {
            self.svg.selectAll("#point").attr("transform", d3.event.transform);
          })
          .on("end", function() {
            self.lastTransform = d3.event.transform;
          });
        this.svg.call(this.zoom).on("wheel", () => d3.event.preventDefault());
      } else {
        this.svg.on(".zoom", null);
      }
    },
    drawInitSpace(spacePoints, parent) {
      let _this = this;
      let points = ``;
      spacePoints.forEach(ele => {
        points += `${ele.x - 236},${ele.y} `;
      });
      points.slice(0, points.length - 1);

      parent
        .append("polygon")
        .attr("points", points)
        .attr("stroke", "green")
        .attr("fill", "orange")
        .attr("stroke-width", 1)
        .attr("stroke-linecap", "square");

      if (_this.lastTransform) {
        const { k, x, y } = _this.lastTransform;
        const t = d3.zoomIdentity.translate(x, y).scale(k);
        parent.call(this.zoom.transform, t);
      }
    },
    onBack() {
      this.fetchTopoFileById(this.data.parentId);
    },
    onGraphDblClick(sender, evt) {
      const cell = evt.getProperty("cell");
      if (!cell && this.data.parentId) {
        //空白处返回
        this.fetchTopoFileById(this.data.parentId);
        return;
      }
      const canDrill = _.get(cell, "data.canDrill", false);
      if (canDrill) {
        // this.fetchTopoFile(cell);
      }
    },
    fetchTopoFile(cell) {
      this.$http({
        method: "post",
        url: "resource/v1/topoFiles/list",
        data: {
          searchParas: {
            conditions: [
              {
                name: "type",
                op: "eq",
                value: this.data.type
              },
              {
                name: "parentId",
                op: "eq",
                value: this.data.id + ""
              },
              {
                name: "resourceId",
                op: "eq",
                value: cell.id
              }
            ]
          }
        },
        showSpin: false
      }).then(result => {
        const topData = _.get(result, "list[0]", null);
        if (topData) {
          this.initData(topData);
        }
      });
    },
    fetchTopoFileById(id) {
      this.$http({
        method: "get",
        url: `resource/v1/topoFiles/${id}`
      }).then(result => {
        if (result) {
          this.initData(result);
        }
      });
    },
    onEdit() {
      // this.$emit("on-edit", this.data);
    },
    onCopy() {
      this.showCopyModal = true;
    },
    doCopy() {
      // this.$http({
      //   method: "POST",
      //   url: `resource/v1/topoFiles/copyFloor`,
      //   data: {
      //     copyFloorNumber: this.item.floor,
      //     copyToFloorNumber: this.copyToFloor
      //   }
      // }).then(result => {
      //   this.$store.dispatch("resource/fetchRegion");
      //   console.log("TCL: doCopy -> result", result);
      // });
    },
    onSearch() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        const cells = this.graph.model.cells;
        this.searchCells = _.filter(cells, v => v.value);
      }
    },
    doSearch(v) {
      const cell = this.graph.model.getCell(v);
      this.graph.setSelectionCell(cell);
    },
    mockAlarm() {
      const alarm = {
        id: "alarmid",
        resourceId: "0b71ebe6c4b34b9ca0ab75584fa87065",
        severity: _.random(1, 4)
      };
      this.graph.addAlarm(alarm);
      // setTimeout(() => {
      //   this.graph.clearAlarm(alarm);
      // }, 2000);
    }
  }
};
</script>

<style lang="less" scoped>
</style>

