<template>
  <div class="theme" id="war">
    <div class="top-left" @click="onRouter('/')">
      <Icon type="ios-analytics" :size="30" style="margin-top:25%;color:#fff;"/>
    </div>
    <div class="top-center">
      <div class="theme-menu">
        <a>INCIO</a>
        <a>SYNOPSIS</a>
        <a>CAST</a>
        <a>GALLERY</a>
        <a>TRAILER</a>
      </div>
    </div>
    <div class="top-right">
      <Icon type="ios-menu" :size="30" style="margin-top:25%;color:#fff;"/>
    </div>
    <div class="center-left">
      <Icon type="logo-android" :size="22" style="margin-top:20px;color:#fff;"/>
      <Icon type="logo-apple" :size="22" style="margin-top:20px;color:#fff;"/>
      <Icon type="ios-appstore" :size="22" style="margin-top:20px;color:#fff;"/>
      <Icon type="ios-at" :size="22" style="margin-top:20px;color:#fff;"/>
    </div>
    <div class="center-center">
      <!-- <div class="header">123</div> -->
      <div class="tips-pane-left">
        <div class="tips-pane-left-as"></div>
        <h1>MIND GEM SYNOPSIS</h1>
        <p>Resources come from the network, the right of interpretation rests with the original author. If there is any infringement, please contact the webmaster to remove the resources immediately.</p>
        <div class="tips-pane-left-mas">VER MAS</div>
      </div>

      <!-- <div class="circle"></div> -->

      <div class="tips-pane-right">
        <div class="tips-pane-right-as"></div>
        <h1>STONE HISTORY</h1>
        <p>Resources come from the network, the right of interpretation rests with the original author. If there is any infringement, please contact the webmaster to remove the resources immediately.</p>
        <div class="tips-pane-right-mas">VER MAS</div>
      </div>
    </div>
    <div class="center-right"></div>
    <div class="bottom-left">
      <Icon type="ios-arrow-dropdown" :size="25" style="margin-top:20px;color:#fff;"/>
    </div>
    <div class="bottom-center">
      <div class="bottom-center-left">
        <Icon type="ios-arrow-back" :size="25"/>
      </div>
      <div class="bottom-center-pane">
        <div
          v-for="(item,key) in gemData"
          :key="key"
          v-bind:class="{'bottom-center-pane-item':true, 'active':item.active}"
          @click="onComd(item.comd)"
        >{{item.name}}</div>
        <!-- <div class="bottom-center-pane-item" @click="onComd('_reality')">REALITY GEM</div>
        <div class="bottom-center-pane-item" @click="onComd('_space')">SPACE GEM</div>
        <div class="bottom-center-pane-item" @click="onComd('_power')">POWER GEM</div>
        <div class="bottom-center-pane-item" @click="onComd('_time')">TIME GEM</div>
        <div class="bottom-center-pane-item" @click="onComd('_mind')">MIND GEM</div>-->
      </div>
      <div class="bottom-center-right">
        <Icon type="ios-arrow-forward" :size="25"/>
      </div>
    </div>
    <div class="bottom-right">ESP</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gemData: [
        { name: "SOUL GEM", active: true, comd: "_soul" },
        { name: "REALITY GEM", active: false, comd: "_reality" },
        { name: "SPACE GEM", active: false, comd: "_space" },
        { name: "POWER GEM", active: false, comd: "_power" },
        { name: "TIME GEM", active: false, comd: "_time" },
        { name: "MIND GEM", active: false, comd: "_mind" }
      ]
    };
  },
  mounted() {
    this.onComd("_soul");
  },
  methods: {
    onComd(val) {
      document.getElementById("war").className = "theme" + val;
      this.gemData.forEach(ele => {
        ele.active = false;
        if (ele.comd == val) ele.active = true;
      });
    },
    onRouter(val) {
      this.$router.push(val);
    }
  }
};
</script>


<style lang="less" scoped>
@black-grey: rgb(39, 39, 39);
@grey-grey: rgb(82, 84, 90);
@white-grey: rgb(215, 215, 215);
@white-light: rgb(228, 228, 230);
.top-left {
  text-align: center;
  height: 100%;
}
.top-center {
  text-align: center;
  height: 100%;
  width: 100%;
  border-left: 1px solid @grey-grey;
  border-right: 1px solid @grey-grey;
}
.top-right {
  text-align: center;
  height: 100%;
}

.center-left {
  border-top: 1px solid @grey-grey;
  border-bottom: 1px solid @grey-grey;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.center-right {
  border-top: 1px solid @grey-grey;
  border-bottom: 1px solid @grey-grey;
}
.center-center {
  border: 1px solid @grey-grey;
  position: relative;

  .tips-pane-left {
    position: absolute;
    top: 50px;
    left: 0;
    // background: rgba(255, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.3);
    padding: 15px 15px 30px 30px;
    width: 360px;
    color: #fff;
    &-as {
      height: 4px;
      width: 30px;
      position: absolute;
      top: 0;
      left: 30px;
    }
    h1 {
      margin-bottom: 8px;
    }
    &-mas {
      position: absolute;
      right: 20px;
      bottom: -20px;
      padding: 8px 40px;
      // background: rgba(255, 255, 255, 0.3);
      background: rgba(0, 0, 0, 0.3);
    }
  }

  .tips-pane-right {
    position: absolute;
    bottom: 50px;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    padding: 15px 15px 30px 30px;
    width: 420px;
    color: #fff;
    &-as {
      height: 4px;
      width: 30px;
      position: absolute;
      top: 0;
      left: 30px;
      background: #999;
    }
    h1 {
      margin-bottom: 8px;
    }
    &-mas {
      position: absolute;
      right: 20px;
      bottom: -20px;
      padding: 8px 40px;
      background: rgba(0, 0, 0, 0.3);
      border: 2px solid #999;
    }
  }
}

.bottom-left {
  text-align: center;
  height: 100%;
}
.bottom-center {
  border-left: 1px solid @grey-grey;
  border-right: 1px solid @grey-grey;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &-left,
  &-right {
    width: 40px;
    padding-top: 20px;
    text-align: center;
    color: #fff;
  }
  &-left {
    border-right: 1px solid @grey-grey;
  }
  &-right {
    border-left: 1px solid @grey-grey;
  }

  &-pane {
    flex: 1;
    display: flex;
    justify-content: space-between;
    text-align: center;
    height: 100%;
    color: #fff;
    &-item {
      height: 100%;
      padding-top: 24px;
      width: 17%;
    }
  }
}
.bottom-right {
  text-align: center;
  height: 100%;
  padding-top: 24px;
  color: #fff;
}
</style>
<style lang="less">
.theme(@backcolor: #EEA2AD, @fcolor: #fff,@bg:#000) {
  // .theme(@backcolor: #EEA2AD, @fcolor: #fff,@bg:url("../assets/img/1.jpg")) {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 60px auto 60px;
  grid-template-rows: 60px auto 60px;
  background: @bg center center no-repeat;
  background-size: 100%, 100%;

  .header {
    color: @fcolor;
    background: @backcolor;
    width: 100%;
    height: 2rem;
    position: relative;
  }

  &-menu {
    margin: 20px auto 0 auto;
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    a {
      color: #fff;
      padding-bottom: 10px;
      border-bottom: 2px solid #ffffff;
    }
  }
  .center-right {
    // filter: blur(5px);
    // background: @bg center right;
  }
  .circle {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 100px;
    top: 80px;
    left: 60%;
    filter: blur(20px);
    background: @backcolor center center;
  }
  .bottom-center-pane {
    .active {
      background: @backcolor;
    }
  }
  .tips-pane-left {
    &-as {
      background: @backcolor;
    }
    &-mas {
      border: 2px solid @backcolor;
    }
  }
}

.theme {
  .theme(#eea2ad, #fff);
}

.theme_soul {
  .theme(rgb(244, 139, 26), #fff, url("../assets/img/00.jpg"));
}
.theme_reality {
  .theme(rgb(254, 15, 38), #fff, url("../assets/img/01.jpg"));
}
.theme_space {
  .theme(rgb(25, 64, 248), #fff, url("../assets/img/02.jpg"));
}
.theme_power {
  .theme(rgb(162, 0, 203), #fff, url("../assets/img/03.jpg"));
}
.theme_time {
  .theme(rgb(53, 241, 29), #fff, url("../assets/img/04.jpg"));
}
.theme_mind {
  .theme(rgb(254, 207, 0), #fff, url("../assets/img/05.jpg"));
}
</style>
