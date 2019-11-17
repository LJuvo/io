<template>
  <div class="sea">
    <header class="sea-left">
      <div class="sea-left-menu">Home</div>
      <div class="sea-left-footer">Juvos.</div>
    </header>
    <section class="sea-content"></section>
  </div>
</template>

<script>
export default {
  methods: {
    onRouter(val) {
      this.$router.push(val);
    }
  }
};
</script>

<style lang="less" scoped>
.sea {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &-left {
    width: 200px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    &-menu {
      flex: 1;
    }
    &-footer {
      height: 120px;
      width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &-content {
    flex: 1;
    min-width: 1000px;
    background: rgba(199, 203, 208, 1);
  }
}
</style>
