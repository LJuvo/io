<template>
  <div class="nature">
    <div class="nature-pane">
      <div class="nature-pane-title">基础属性</div>
      <div class="nature-pane-content">neirong</div>
    </div>
    <div class="nature-pane">
      <div class="nature-pane-title">基础属性</div>
      <div class="nature-pane-content">neirong</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.nature {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  &-pane {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    &-title {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      background: #efefef;
      padding: 0 10px;
    }
    &-content {
      padding: 5px;
    }
  }
}
</style>
