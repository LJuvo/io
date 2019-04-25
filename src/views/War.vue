<template>
  <div class="theme"  id="war">
    <div class="top-left">1</div>
    <div class="top-center">2</div>
    <div class="top-right">3</div>
    <div class="center-left">4</div>
    <div class="center-center">
      <div class="header">123</div>
    </div>
    <div class="center-right">6</div>
    <div class="bottom-left">7</div>
    <div class="bottom-center">
      <!-- <Button type="info" @click="onComd('a')">Info</Button>
      <Button type="success" @click="onComd('b')">Success</Button>
      <Button type="warning" @click="onComd('c')">Warning</Button>
      <Button type="error" @click="onComd('')">Error</Button>-->
      <Button class="primary" @click="onComd('_soul')">_soul</Button>
      <Button type="error" @click="onComd('_reality')">_reality</Button>
      <Button type="error" @click="onComd('_space')">_space</Button>
      <Button type="error" @click="onComd('_power')">_power</Button>
      <Button type="error" @click="onComd('_time')">_time</Button>
      <Button type="error" @click="onComd('_mind')">_mind</Button>
    </div>
    <div class="bottom-right">9</div>
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
.top-left{}
.top-center{}
.top-right{}

.center-left{filter:blur(5px);}
.center-right{filter:blur(20px);}
.center-center{
  
    
    -webkit-filter: blur(10px); /* Chrome, Opera */
       -moz-filter: blur(10px);
        -ms-filter: blur(10px);    
            filter: blur(10px);
    
    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false);
}
// .center-center:before{
//   content:'';
//   height:100%;
//   width:100%;
//   filter:blur(20px);
// }

.bottom-left{}
.bottom-center{}
.bottom-right{}

</style>
<style lang="less">
.theme(@backcolor: #EEA2AD, @fcolor: #fff,@bg:url('../assets/img/1.jpg')) {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 60px auto 60px;
  grid-template-rows: 60px auto 60px;
  background:@bg center center no-repeat;

  .header {
    color: @fcolor;
    background: @backcolor;
    width: 100%;
    height: 2rem;
    position: relative;
  }
}

.themea {
  .theme(#ff0000, #fff,url('../assets/img/1.png'));
}

.themeb {
  .theme(blue, #fff,url('../assets/img/0.png'));
}

.themec {
  .theme(#fff, #999);
}
.theme {
  .theme(#eea2ad, #fff);
}

.theme_soul {
  .theme(rgb(244, 139, 26), #fff,url('../assets/img/1.png'));
}
.theme_reality {
  .theme(rgb(254, 15, 38), #fff,url('../assets/img/0.png'));
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
