<template>
  <div :style="secondMenuSty">
    <slot name="tipLabel"></slot>
    <div :style="sideMenuSty" class="side-menu-sty">
      <slot name="sideMenu"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      secondMenuSty: {
        width: "180px",
        height: "100%",
        background: "#e6e9ee"
      },
      sideMenuSty: {
        width: "100%",
        height: "calc(100% - 50px)",
        overflow: "hidden",
        "overflow-y": "auto"
      }
    };
  }
};
</script>

<style>
</style>
