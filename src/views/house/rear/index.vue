<template>
  <div class="rear-pane">
    <div class="rear-grid">
      <basic-rear-model></basic-rear-model>
      <basic-rear-model></basic-rear-model>
      <basic-rear-model></basic-rear-model>
      <basic-rear-model></basic-rear-model>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routerModel: {
      type: String,
      default: "default"
    }
  },
  components: { BasicRearModel: () => import("./comps/BasicRear") }
};
</script>

<style lang="less" scoped>
.rear-pane {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  overflow-y: auto;
}
.rear-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  background: #333;
}
</style>
