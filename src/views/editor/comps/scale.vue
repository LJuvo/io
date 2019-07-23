<template>
  <div class="scale-set">
    <div class="scale-set-btn">
      <Icon size="22" type="md-remove" />
    </div>
    <span class="scale-set-num">60%</span>
    <div class="scale-set-btn">
      <Icon size="22" type="md-add" />
    </div>
    <span class="scale-set-ruler">参考线</span>
  </div>
</template>

<script>
export default {};
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

