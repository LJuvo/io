<template>
  <div class="layout">
    <div class="layout-pane one" v-if="placement == 'default'">
      <div class="left">
        <slot name="leftpane"></slot>
      </div>
      <div class="right">
        <slot name="rightpane"></slot>
      </div>
      <div class="center">
        <slot name="centerpane"></slot>
      </div>
    </div>

    <div class="layout-pane two" v-if="placement == 'one'">
      <div class="left">
        <slot name="leftpane"></slot>
      </div>
      <div class="right">
        <slot name="rightpane"></slot>
      </div>
      <div class="center">
        <slot name="centerpane"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placement: {
      type: String,
      default: "default"
    }
  }
};
</script>
<style lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
  &-pane {
    width: 100%;
    height: 100%;
  }

  .one {
    .left {
      float: left;
      width: 80px;
    }
    .right {
      float: right;
      width: 80px;
    }
    .center {
      margin: 0 80px;
    }
  }

  .two {
    .left {
      float: left;
      width: 240px;
    }
    .right {
      float: right;
      width: 240px;
    }
    .center {
      margin: 0 240px;
    }
  }
}
</style>

