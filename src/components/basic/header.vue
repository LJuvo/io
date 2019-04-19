<template>
  <div class="header">
    <div class="header-logo">
      <div class="header-circle"></div>BLACK NiGHT
    </div>
    <div class="header-pane">
      <router-link to="/" class="header-pane-item">Home</router-link>
      <router-link to="/about" class="header-pane-item">About</router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
@import "../../common/style/color.less";

.header {
  height: 3em;
  margin: 2rem auto;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 2.5rem;
  line-height: 3rem;
  &-logo {
    display: flex;
    line-height: 3rem;
    height: 3rem;
  }
  &-circle {
    content: "";
    width: 1.2rem;
    height: 1.2rem;
    border: 4px solid @white-grey;
    border-radius: 1rem;
    font-size: 1.5rem;
    line-height: 3rem;
    margin: 0.5rem;
  }
  &-pane {
    &-item {
      margin-right: 0.5rem;
    }
  }
}
</style>
