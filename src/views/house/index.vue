<template>
  <div class="house">
    <Layout :placement="placement">
      <div slot="leftpane">左边</div>
      <div slot="rightpane">右边</div>
      <div slot="centerpane">
        <h1>HOUSE</h1>
        <Button @click="onChangePlace">改变</Button>
      </div>
    </Layout>
  </div>
</template>

<script>
import Layout from "./comps/layout";
export default {
  components: { Layout },
  data() {
    return {
      placement: "default"
    };
  },
  methods: {
    onChangePlace() {
      if (this.placement == "default") return (this.placement = "one");
      return (this.placement = "default");
    }
  }
};
</script>

<style lang="less" scoped>
.house {
  width: 100%;
  height: 100%;
  background: #ffffff;
}
</style>
