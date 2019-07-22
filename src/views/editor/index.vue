<template>
  <div class="basic-pane">
    <div class="basic-pane-bar">
      <div class="bar-list">
        <div class="bar-list-title">元素</div>
        <div class="bar-list-pane">
          <div class="bar-list-pane-item" v-for="(item,key) in iconList" :key="key">
            <img :src="item.url" />
          </div>
        </div>
      </div>
    </div>
    <div class="basic-pane-wrapper">
      <div class="basic-pane-wrapper-tools">tools</div>
      <div class="basic-pane-wrapper-content">
        other
        <div class="basic-pane-scale">
          <div class="basic-pane-scale-set">
            <div class="basic-pane-scale-set-btn">
              <Icon size="22" type="md-remove" />
            </div>
            <span class="basic-pane-scale-set-num">60%</span>
            <div class="basic-pane-scale-set-btn">
              <Icon size="22" type="md-add" />
            </div>
            <span class="basic-pane-scale-set-ruler">参考线</span>
          </div>
        </div>
      </div>
    </div>
    <div class="basic-pane-nature">right</div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      iconList: [
        { label: "bale0", url: "cuse/0.png" },
        { label: "bale1", url: "cuse/1.png" },
        { label: "bale2", url: "cuse/2.png" },
        { label: "bale3", url: "cuse/3.png" },
        { label: "bale4", url: "cuse/4.png" },
        { label: "bale5", url: "cuse/5.png" },
        { label: "bale6", url: "cuse/6.png" },
        { label: "bale7", url: "cuse/7.png" }
      ]
    };
  },
  mounted() {},
  methods: {
    init() {}
  }
};
</script>
<style lang='less' scoped>
.basic-pane {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 20% auto 20%;
  background: #e7e8f1;

  &-bar {
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
  &-wrapper {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 50px auto;
    &-tools {
      width: 100%;
      height: 50px;
    }
    &-content {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
  &-nature {
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
  &-scale {
    box-sizing: border-box;
    padding: 0 20px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 20px;
    position: absolute;
    transform: translate(-50%, 0);
    left: 50%;
    bottom: 16px;
    &-set {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      color: #ffffff;
      text-align: center;
      height: 38px;
      &-btn {
        width: 32px;
      }
      &-num {
        width: 64px;
      }
      &-ruler {
        width: 64px;
      }
    }
  }
}
.bar-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  &-title {
    font-size: 16px;
    font-weight: 600;
    padding: 10px;
  }
  &-pane {
    width: 100%;
    padding: 10px;
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    &-item {
      padding: 10px;
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
}
</style>