<template>
  <div class="basic-pane">
    <slot name="menu-item"></slot>
    <a
      v-for="(item,key) in menuChildArr"
      :key="key"
      :class="{'basic-item':true,'basic-active':item.checked}"
      @click="onCheckedMenu(item.id)"
    >{{item.label}}-{{item.checked}}</a>
  </div>
</template>
<script>
export default {
  props: {
    initarr: {
      type: Array,
      default: []
    }
  },
  components: {},
  data() {
    return {
      menuChildArr: []
    };
  },
  watch: {},
  mounted() {
    if (this.initarr.length < 1) return;
    this.menuChildArr = this.initarr;
    this.onCheckedMenu(this.menuChildArr[0].id);
  },
  methods: {
    menuFormat(arr, checked) {
      arr.forEach(ele => {
        ele.checked = false;
        if (checked == ele.id) ele.checked = true;
      });
      return arr;
    },
    onCheckedMenu(val) {
      let arr = this.menuFormat(this.menuChildArr, val);
      this.menuChildArr = [];
      this.menuChildArr = arr;
    }
  },
  beforeDestroy() {}
};
</script>
<style lang='less' scoped>
.basic-pane {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background: #ffffff;
}
.basic-item {
  margin: 10px;
  color: #333;
}
.basic-active {
  color: #ff0000;
}
</style>