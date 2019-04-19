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
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @white-grey;
}
a {
  color: @white-grey;
  text-decoration: none;
}
</style>
