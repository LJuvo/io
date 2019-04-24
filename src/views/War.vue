<template>
  <div class="wrapper">
    <div class="item1">1</div>
    <div class="item2">2</div>
    <div class="item3">3</div>
    <div class="item4">4</div>
    <div class="item5 theme" id="war">
      <div class="header">123</div>
    </div>
    <div class="item6">6</div>
    <div class="item7">7</div>
    <div class="item8">
      <!-- <Button type="info" @click="onComd('a')">Info</Button>
      <Button type="success" @click="onComd('b')">Success</Button>
      <Button type="warning" @click="onComd('c')">Warning</Button>
      <Button type="error" @click="onComd('')">Error</Button>-->
      <Button class="theme_soul" @click="onComd('_soul')">_soul</Button>
      <Button type="error" @click="onComd('_reality')">_reality</Button>
      <Button type="error" @click="onComd('_space')">_space</Button>
      <Button type="error" @click="onComd('_power')">_power</Button>
      <Button type="error" @click="onComd('_time')">_time</Button>
      <Button type="error" @click="onComd('_mind')">_mind</Button>
    </div>
    <div class="item9">9</div>
  </div>
</template>

<script>
export default {
  methods: {
    onComd(val) {
      document.getElementById("war").className = "theme" + val;
    }
  }
};
</script>


<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 60px auto 60px;
  grid-template-rows: 60px auto 60px;
}
.item1,
.item3,
.item7,
.item9 {
  background: #ff0000;
}
.item2,
.item8 {
  background: #ff00ff;
}
.item4,
.item6 {
  background: #ffff00;
}
</style>
<style lang="less">
.theme(@backcolor: #EEA2AD, @fcolor: #fff) {
  .header {
    color: @fcolor;
    background: @backcolor;
    width: 100%;
    height: 2rem;
    position: relative;
  }
}

.themea {
  .theme(#ff0000, #fff);
}

.themeb {
  .theme(blue, #fff);
}

.themec {
  .theme(#fff, #999);
}
.theme {
  .theme(#eea2ad, #fff);
}

.theme_soul {
  .theme(rgb(244, 139, 26), #fff);
}
.theme_reality {
  .theme(rgb(254, 15, 38), #fff);
}
.theme_space {
  .theme(rgb(25, 64, 248), #fff);
}
.theme_power {
  .theme(rgb(162, 0, 203), #fff);
}
.theme_time {
  .theme(rgb(53, 241, 29), #fff);
}
.theme_mind {
  .theme(rgb(254, 207, 0), #fff);
}
</style>
