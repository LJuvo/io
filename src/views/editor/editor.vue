<template>
  <div class="basic-pane">
    <div class="basic-pane-bar">
      <nav-model ref="nav"></nav-model>
    </div>
    <div class="basic-pane-wrapper">
      <div class="basic-pane-wrapper-tools">
        <tools-model ref="tools"></tools-model>
      </div>
      <div class="basic-pane-wrapper-content">
        <work-space ref="workspace"></work-space>
        <div class="basic-pane-scale">
          <scale-model ref="scale"></scale-model>
        </div>
        <div class="basic-pane-bird">
          <bird-eye-model ref="birdeye"></bird-eye-model>
        </div>
      </div>
    </div>
    <div class="basic-pane-nature">
      <nature-model ref="nature">
        <template slot="natureslot">
          <Button @click="$emit('on-destory')">销毁画布</Button>
        </template>
      </nature-model>
    </div>
  </div>
</template>
<script>
import NavModel from "./comps/nav";
import ToolsModel from "./comps/tools";
import ScaleModel from "./comps/scale";
import NatureModel from "./comps/nature";
import WorkSpace from "./comps/workspace";
import BirdEyeModel from "./comps/birdeye";
export default {
  props: {},
  components: {
    NavModel,
    ToolsModel,
    ScaleModel,
    NatureModel,
    WorkSpace,
    BirdEyeModel
  },
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
      this.$nextTick(() => {
        this.graph = this.$refs.workspace.getGraph();
        this.graph.scrollTileSize = new mxRectangle(
          0,
          0,
          this.$refs.workspace.offsetWidth,
          this.$refs.workspace.offsetHeight
        );
        // this.$refs.toolbar.initGraph(graph);
        this.$refs.nav.initGraph(this.graph);
        this.$refs.birdeye.initGraph(this.graph);
        this.$refs.scale.initGraph(this.graph);
        this.$refs.nature.initGraph(this.graph);
      });
    },
    destory() {
      this.graph.destory();
    }
  },
  beforeDestroy() {
    this.destory();
  }
};
</script>
<style lang='less' scoped>
.basic-pane {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 20% auto 20%;
  // background: #e7e8f1;
  background: #ffffff;

  &-bar {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-right: 1px solid #dddddd;
  }
  &-wrapper {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 50px auto;
    &-tools {
      width: 100%;
      height: 50px;
      background: #ffffff;
      border-bottom: 1px solid #dddddd;
    }
    &-content {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  &-nature {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-left: 1px solid #dddddd;
  }
  &-scale {
    box-sizing: border-box;
    padding: 0 20px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 20px;
    position: absolute;
    transform: translate(-50%, 0);
    left: 50%;
    bottom: 16px;
  }
  &-bird {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>