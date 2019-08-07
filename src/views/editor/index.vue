<template>
  <div class="basic-pane">
    <div class="basic-wrapper" v-if="paneState">
      <div class="basic-wrapper-web">
        <div>画布大小</div>
        <div class="basic-wrapper-web-btn">
          <Button @click="paneState=!paneState">创建画布</Button>
        </div>
      </div>
    </div>
    <editor-model v-else @on-destory="paneState=!paneState"></editor-model>
  </div>
</template>
<script>
import EditorModel from "./editor";
export default {
  props: {},
  components: {
    EditorModel
  },
  data() {
    return {
      paneState: true
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style lang='less' scoped>
.basic-pane {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
}
.basic-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &-web {
    display: grid;
    grid-template-rows: auto 50px;
    width: 400px;
    height: 300px;
    border: 1px solid #efefef;
    &-btn {
      padding: 5px;
      border-top: 1px solid #efefef;
    }
  }
}
</style>