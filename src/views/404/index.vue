<template>
  <div style="text-align:center;padding-top:40px;">
    <a style="text-decoration: none;color:#ccc;font-size:14px;" @click="onRouter('/')">返回主页</a>
    <h1 style="font-size:10rem;color:#333;">404</h1>
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
</style>
