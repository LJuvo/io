<template>
  <div>
    <div class="nav-collapse">
      <span class="panel-title">测试</span>
      <div slot="content" class="nav-panel">
        <div class="img-container">
          <!-- <Tooltip :content="resClass.objectName" placement="right"> -->
          <div class="nav-drag-item">
            <img ref="dragImg" :src="'imgs/graph/default.svg'" />
            <div class="text-omit">123</div>
          </div>
          <!-- </Tooltip> -->
        </div>
      </div>
    </div>
    <div class="outline-wrapper">
      <label style="padding: 4px 8px;">鸟瞰图</label>
      <div id="graphOutline" />
    </div>
  </div>
</template>

<script>
import mxgraph from "./core/index.js";
const { mxOutline } = mxgraph;
export default {
  data() {
    return {
      collapseValue: "",
      graph: null,
      list: [],
      outline: null,
      isInited: false
    };
  },
  mounted() {},
  methods: {
    initGraph(graph) {
      this.graph = graph;
      // this.initRes(null, true);
      if (!this.outline) {
        mxOutline.prototype.border = 6;
        this.outline = new mxOutline(
          graph,
          document.getElementById("graphOutline")
        );
        this.graph.makedraggable();
      }
    },
    initRes(resList, needInit) {
      //   console.log("TCL: initRes -> resList", resList);
      //   let rank2List = resList;
      //   if (needInit) {
      //     const resList = this.$store.state.resource.resClasses;
      //     const rank3List = _.filter(
      //       resList,
      //       v =>
      //         v.rank == 3 && (v.basicClass === "设备" || v.basicClass === "地域")
      //     );
      //     const rank2Ids = _.map(rank3List, "parentId");
      //     rank2List = _.filter(resList, v => {
      //       return v.rank === 2 && rank2Ids.includes(v.id);
      //     });
      //   }
      //   const grouped = _.groupBy(rank2List, "basicClass");
      //   let list = [];
      //   _.keys(grouped).forEach(key => {
      //     list.push({
      //       type: key,
      //       children: grouped[key]
      //     });
      //   });
      //   this.list = list;
      //   this.$nextTick(() => {
      //     if (!this.isInited) {
      //       this.graph.makedraggable();
      //       this.isInited = true;
      //     }
      //     this.collapseValue = list[0].type;
      //   });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../styles/compNav.less";
</style>