<template>
  <div class="basic">
    <div class="basic-content">内容</div>
    <div class="basic-footer">footer</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.basic {
  display: flex;
  flex-direction: column;
  height: 300px;
  &-footer {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
    width: 100%;
  }
  &-content {
    flex: 1;
  }
}
</style>
