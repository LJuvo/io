<template>
  <Modal v-model="isShow" draggable scrollable title="图层管理">
    <div></div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    toggle() {
      this.isShow = !this.isShow;
    }
  }
};
</script>

<style>
</style>
