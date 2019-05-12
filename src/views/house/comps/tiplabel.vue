<template>
  <div :style="tipLabelSty">
    <span :style="tipLabelTipSty"></span>
    <span :style="tipLabelTitleSty">{{name}}</span>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "未设定名称"
    }
  },
  data() {
    return {
      tipLabelSty: {
        width: "100%",
        height: "30px",
        padding: "20px 10px",
        display: "flex",
        "flex-direction": "row",
        "align-items": "center"
      },
      tipLabelTipSty: {
        width: "4px",
        height: "20px",
        background: "#333",
        "margin-right": "10px"
      },
      tipLabelTitleSty: {
        "font-size": "14px"
      }
    };
  }
};
</script>

<style>
</style>
