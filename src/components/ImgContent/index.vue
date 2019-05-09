<template>
  <div class="img-content">
    <div class="content-pane" v-if="offset=='left'">
      <div class="content-pane-img">
        <img src="../../assets/img/mas.png">
      </div>
      <div class="content-pane-info">
        <h1>{{content.enTitle}}</h1>
        <div class="content-pane-info-title">{{content.zhTitle}}</div>
        <div class="content-pane-info-content">{{content.info}}</div>
      </div>
    </div>
    <div class="content-pane" v-if="offset=='right'">
      <div class="content-pane-info">
        <h1>{{content.enTitle}}</h1>
        <div class="content-pane-info-title">{{content.zhTitle}}</div>
        <div class="content-pane-info-content">{{content.info}}</div>
      </div>
      <div class="content-pane-img">
        <img src="../../assets/img/mas.png">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    offset: {
      type: String,
      default: "left"
    }
  },
  data() {
    return {
      content: {
        zhTitle: "市场分析",
        enTitle: "MARKET ANALYSS",
        info:
          "意大利超豪华汽车品牌玛莎拉蒂携2019款全系车型登陆第十八届上海国际车展。独一无二的私人定制版Quattroporte总裁轿车首次亮相，昭示玛莎拉蒂未来个性化定制风向。同时，Quattroporte总裁轿车杰尼亚特别版首次运用杰尼亚PELLETESSUTA™创新材质，以立体柔韧质感为豪华内饰加码。与玛莎拉蒂非凡座驾相呼应的个性化定制专区，将精湛工艺、领先科技和意式美学完美融合，彰显意式卓越品质与生活方式。",
        img: "./img/mas.png"
      }
    };
  }
};
</script>

<style lang="less" scoped>
.img-content {
  width: 100%;
  // height: 350px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  background: #fff;
}
.content-pane {
  width: 100%;
  // height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  &-img {
    width: 50%;
    display: flex;
    align-items: Center;
    img {
      width: 100%;
    }
  }
  &-info {
    flex: 1;
    padding: 0 40px;
    h1 {
      font-weight: 100;
      font-size: 40px;
    }
    &-title {
      font-size: 25px;
      margin-bottom: 20px;
    }
    &-content {
      margin-bottom: 20px;
    }
  }
}

@media screen and (max-width: 800px) {
  .content-pane {
    flex-direction: column;
    &-img {
      width: 100%;
    }
    &-info {
      padding: 0;
      padding-top: 20px;
    }
  }
}
</style>
