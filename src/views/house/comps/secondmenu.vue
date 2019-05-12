<template>
  <div :style="secondMenuSty">
    <slot name="tipLabel"></slot>
    <slot name="sideMenu" :style="sideMenuSty"></slot>
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
        width: "100%"
      }
    };
  }
};
</script>

<style>
</style>
