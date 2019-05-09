<template>
  <div style="width:100%;max-width: 1200px;margin:0 auto;background:#fff;padding:40px 0;">
    <div v-if="offset == 'left'">
      <div class="list-item-pane" v-for="(item,key) in list" :key="key">
        <div class="list-item-pane-title">
          <div class="list-item-pane-title-pane">
            <h1>{{item.enTitle}}</h1>
            <span>{{item.zhTitle}}</span>
          </div>
          <a class="list-item-pane-title-btn">SHOW MORE >></a>
        </div>
        <div class="list-item-pane-info">{{item.info}}</div>
        <div class="list-item-pane-img">
          <!-- <img :src="item.img"> -->
          <img src="../../assets/img/mas.png">
        </div>
      </div>
    </div>
    <div v-else-if="offset == 'right'">
      <div class="list-item-pane-right" v-for="(item,key) in list" :key="key">
        <div class="list-item-pane-img">
          <!-- <img :src="item.img"> -->
          <img src="../../assets/img/mas.png">
        </div>
        <div class="list-item-pane-info">{{item.info}}</div>
        <div class="list-item-pane-title">
          <div class="list-item-pane-title-pane">
            <h1>{{item.enTitle}}</h1>
            <span>{{item.zhTitle}}</span>
          </div>
          <a class="list-item-pane-title-btn">SHOW MORE >></a>
        </div>
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
      list: [
        {
          zhTitle: "市场分析",
          enTitle: "MARKET ANALYSS",
          info:
            "意大利超豪华汽车品牌玛莎拉蒂携2019款全系车型登陆第十八届上海国际车展。独一无二的私人定制版Quattroporte总裁轿车首次亮相，昭示玛莎拉蒂未来个性化定制风向。同时，Quattroporte总裁轿车杰尼亚特别版首次运用杰尼亚PELLETESSUTA™创新材质，以立体柔韧质感为豪华内饰加码。与玛莎拉蒂非凡座驾相呼应的个性化定制专区，将精湛工艺、领先科技和意式美学完美融合，彰显意式卓越品质与生活方式。",
          img: "./img/mas.png"
        },
        {
          zhTitle: "市场分析",
          enTitle: "MARKET ANALYSS",
          info:
            "意大利超豪华汽车品牌玛莎拉蒂携2019款全系车型登陆第十八届上海国际车展。独一无二的私人定制版Quattroporte总裁轿车首次亮相，昭示玛莎拉蒂未来个性化定制风向。同时，Quattroporte总裁轿车杰尼亚特别版首次运用杰尼亚PELLETESSUTA™创新材质，以立体柔韧质感为豪华内饰加码。与玛莎拉蒂非凡座驾相呼应的个性化定制专区，将精湛工艺、领先科技和意式美学完美融合，彰显意式卓越品质与生活方式。",
          img: "./../assets/img/mas.png"
        },
        {
          zhTitle: "市场分析",
          enTitle: "MARKET ANALYSS",
          info:
            "意大利超豪华汽车品牌玛莎拉蒂携2019款全系车型登陆第十八届上海国际车展。独一无二的私人定制版Quattroporte总裁轿车首次亮相，昭示玛莎拉蒂未来个性化定制风向。同时，Quattroporte总裁轿车杰尼亚特别版首次运用杰尼亚PELLETESSUTA™创新材质，以立体柔韧质感为豪华内饰加码。与玛莎拉蒂非凡座驾相呼应的个性化定制专区，将精湛工艺、领先科技和意式美学完美融合，彰显意式卓越品质与生活方式。",
          img: "./static/fly.jpg"
        }
      ]
    };
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.list-item-pane {
  width: 100%;
  padding: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &-title {
    width: 200px;
    margin-right: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-pane {
      h1 {
        font-size: 30px;
        font-weight: 100;
        line-height: 30px;
      }
      span {
        font-size: 25px;
      }
    }
    &-btn {
      text-decoration: none;
      color: #aaa;
    }
  }
  &-info {
    flex: 1;
  }

  &-img {
    width: 300px;
    margin-left: 40px;
    img {
      width: 100%;
    }
  }
}
.list-item-pane-right {
  width: 100%;
  padding: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .list-item-pane-title {
    margin-left: 40px;
    margin-right: 0;
  }

  .list-item-pane-img {
    margin-right: 40px;
    margin-left: 0;
  }
}
@media screen and (max-width: 800px) {
  .list-item-pane {
    padding: 20px 40px;
    border-bottom: 1px solid #eeeeee;
    flex-direction: column;

    &-title {
      width: 100%;
      margin-right: 0;
      margin-bottom: 15px;
      flex-direction: column;
    }
    &-info {
      width: 100%;
      margin-bottom: 15px;
    }

    &-img {
      width: 100%;
      margin-left: 0;
    }
  }
  .list-item-pane:last-child {
    border: none;
    padding-bottom: 0;
  }
  .list-item-pane-right {
    .list-item-pane-img {
      margin: 20px 0;
      margin-right: 40px;
    }
  }
}
</style>
