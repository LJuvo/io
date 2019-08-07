<template>
  <div class="scale-set">
    <div class="scale-set-btn">
      <Icon size="22" type="md-remove" @click="onZoomOut" />
    </div>
    <span class="scale-set-num">{{spaceScale}}%</span>
    <div class="scale-set-btn">
      <Icon size="22" type="md-add" @click="onZoomIn" />
    </div>
    <span class="scale-set-ruler">参考线</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spaceScale: 100,
      graph: null
    };
  },
  watch: {
    "graph.pageScale"(v) {
      // console.log(v);
    },
    "graph.view.scale"(v) {
      // console.log(v);
    }
  },
  methods: {
    initGraph(graph) {
      this.graph = graph;
      this.spaceScale = parseInt(this.graph.view.scale * 100);
      // console.log(graph.pageScale, graph.view.scale);
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

<style lang="less" scoped>
.scale-set {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  color: #ffffff;
  text-align: center;
  height: 38px;
  &-btn {
    width: 32px;
  }
  &-num {
    width: 64px;
  }
  &-ruler {
    width: 64px;
  }
}
</style>

