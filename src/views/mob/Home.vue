<template>
  <div class="home">
    <Header></Header>
    <section class="home-content">
      <section class="home-content-mtxt">
        <h1>SWIMMING</h1>
        <h1>at the world</h1>
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
  &-content {
    margin-top: 10rem;
    &-mtxt {
      h1 {
        font-size: 3rem;
        line-height: 3.2rem;
        margin: 0;
      }
    }
    &-ltxt {
      font-size: 1.2rem;
      text-align: left;
      margin-top: 10rem;
      padding-left: 3.2rem;
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

