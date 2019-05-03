<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
@import "./common/style/color.less";
html,
body {
  margin: 0;
  padding: 0;
  background: @black-grey;
  height: 100%;
  width: 100%;
}
body {
  background: none !important;
}
#app {
  font-family: "OpenSans", sans-serif, Helvetica, Arial, "Avenir";
  height: 100%;
  width: 100%;
}
a {
  color: @white-grey;
  text-decoration: none;
}
.ivu-drawer-content {
  background-color: rgba(0, 0, 0, 0.7) !important;
}
.ivu-drawer-header p,
.ivu-drawer-header-inner,
.ivu-drawer-header {
  color: @white-grey !important;
}
.ivu-drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
