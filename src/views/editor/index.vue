<template>
  <div class="basic-pane">
    <div class="basic-pane" v-if="paneState">
      <Button @click="paneState=!paneState">创建画布</Button>
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
      paneState: false
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
</style>