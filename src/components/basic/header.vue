<template>
  <div class="header">
    <div class="header-logo">
      <span class="header-logo-circle"></span>
      <span>BLACK NiGHT</span>
    </div>
    <div class="header-pane">
      <router-link to="/" class="header-pane-item">Home</router-link>
      <router-link to="/about" class="header-pane-item">About</router-link>
      <Icon type="ios-infinite" :size="25" color="#fff" @click="headerModel=!headerModel"/>
    </div>

    <Drawer title="BLACK NiGHT" width="400" :closable="false" v-model="headerModel">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headerModel: false
    };
  }
};
</script>

<style lang="less" scoped>
@import "../../common/style/color.less";

.header {
  height: 50px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 50px;
  &-logo {
    display: flex;
    line-height: 50px;
    height: 50px;
    font-size: 20px;
    padding-left: 40px;
    &-circle {
      width: 25px;
      height: 25px;
      border: 2px solid @white-grey;
      border-radius: 50px;
      margin: 12px 15px 8px 0;
    }
  }

  &-pane {
    flex: 1;
    padding-right: 40px;
    text-align: right;
    &-item {
      margin-right: 20px;
      color: @white-grey;
      text-decoration: none;
      font-size: 14px;
    }
  }
}
</style>

