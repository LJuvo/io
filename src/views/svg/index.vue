<template>
  <div class="basic-pane">
    <div class="basic-pane-item" v-for="(item,key) in imgArr" :key="key">
      <img :src="item.url" />
      <span>{{item.label}}</span>
    </div>
  </div>
</template>
<script>
import { svgArr } from "../../api/svg";
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  computed: {
    imgArr() {
      return svgArr;
    }
  },
  mounted() {},
  methods: {
    init() {},
    start() {},
    restart() {},
    load() {},
    reload() {},
    destory() {}
  },
  beforeDestroy() {}
};
</script>
<style lang='less' scoped>
.basic-pane {
  width: 100%;
  height: 100%;
  background: #333;
  overflow: hidden;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  &-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: center;
    padding: 10px;
    img {
      width: 100%;
      height: 100px;
    }
    span {
      margin: 10px auto;
      font-size: 16px;
      color: #eeeeee;
    }
  }
}
</style>