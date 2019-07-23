<template>
  <div class="tools">
    <div class="tools-left">
      <div class="tools-left-btn">
        <Icon size="22" type="ios-star" />
      </div>
      <div class="tools-left-btn">
        <Icon size="22" type="ios-star" />
      </div>
      <div class="tools-left-btn">
        <Icon size="22" type="ios-star" />
      </div>
    </div>
    <div class="tools-right"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.tools {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &-left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
    &-btn {
      margin-left: 5px;
    }
  }
}
</style>
