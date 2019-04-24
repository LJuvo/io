<template>
  <div class="home">
    <Header></Header>
    <section class="home-content">
      <section class="home-content-mtxt">
        <div class="home-content-mtxt-left">
          <h1 style="color:rgb(235, 169, 96)">SWIMMING</h1>
          <h1>at the world</h1>
        </div>
        <div class="home-content-mtxt-right">
          <div class="home-content-mtxt-right-pane">
            <!-- <img src="../../static/fly.jpg"> -->
          </div>
        </div>
      </section>
      <section class="home-content-ltxt">
        <div class="home-content-ltxt-posze">| 01</div>
        <div class="home-content-ltxt-posze">TO BE A ViEWER</div>
        <div class="home-content-ltxt-next">NEXT</div>
      </section>
    </section>
  </div>
</template>

<script>
import Header from "../components/basic/header";
export default {
  name: "home",
  components: { Header }
};
</script>
<style lang="less" scoped>
@import "../common/style/color.less";
.home {
  width: 100%;
  height: 100%;
  &-content {
    height: calc(100% - 50px);
    position: relative;
    &-mtxt {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      &-left {
        width: 40%;
        padding-top: 200px;
        h1 {
          margin-top: 20%;
          font-size: 3rem;
          line-height: 3.2rem;
          margin: 0;
        }
      }
      &-right {
        flex: 1;
        &-pane {
          margin: 0 auto;
          margin-top: 8%;
          width: 80%;
          height: 70%;
          box-shadow: 1px 1px 5px #333333;
          background: url("../../static/fly.jpg") center center no-repeat;
          img {
            height: 100%;
          }
        }
      }
    }
    &-ltxt {
      position: absolute;
      bottom: 40px;
      font-size: 1.2rem;
      text-align: left;
      margin-top: 10rem;
      padding-left: 40px;
      &-posze {
        color: white;
        margin: 0.8rem 0;
      }
      &-next {
        color: @grey-grey;
      }
    }
  }
}
</style>

