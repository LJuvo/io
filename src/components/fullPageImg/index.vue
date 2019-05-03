<template>
  <div class="full-pane">
    <div class="full-pane-ground">
      <h1 class="full-pane-ground-title">BIGSEA STUDIO</h1>
      <div class="full-pane-ground-grid">
        <div class="full-pane-ground-grid-item">
          <Icon type="ios-archive" class="full-pane-ground-grid-item-icon"/>
          <span>BIG</span>
        </div>
        <div class="full-pane-ground-grid-item">
          <Icon type="ios-archive" class="full-pane-ground-grid-item-icon"/>
          <span>BIG</span>
        </div>
        <div class="full-pane-ground-grid-item">
          <Icon type="ios-archive" class="full-pane-ground-grid-item-icon"/>
          <span>BIG</span>
        </div>
        <div class="full-pane-ground-grid-item">
          <Icon type="ios-archive" class="full-pane-ground-grid-item-icon"/>
          <span>BIG</span>
        </div>
      </div>
      <div class="full-pane-ground-footer">Brand Web Design</div>
    </div>
    <!-- <img
      src="../../assets/img/mas.png"
      style="position:absolute;z-index:0;left:0;top:0;width:100%;"
    >-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      bg: "url('../../assets/img/mas.png')"
    };
  }
};
</script>

<style lang="less" scoped>
.full-pane {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-size: cover;
  background: url("../../assets/img/mas.png") center no-repeat;

  &-ground {
    position: absolute;
    left: 0;
    top: 15%;
    width: 300px;
    height: 60%;
    background: rgba(0, 0, 0, 0.75);
    color: #eeeeee;
    font-weight: 100;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

    &-title {
      margin: 20px auto;
      margin-top: 25px;
      font-size: 28px;
      color: rgba(255, 255, 255, 0.8);
    }
    &-grid {
      display: grid;
      width: 100%;
      height: 60%;
      text-align: center;
      grid-template-columns: 50% 50%;
      grid-template-rows: 50% 50%;

      &-item {
        font-size: 22px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        &-icon {
          font-size: 60px;
        }
        span {
          margin-top: -30px;
        }
      }
      &-item:first-child {
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        border-right: 1px solid rgba(255, 255, 255, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
      &-item:nth-child(2) {
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
      &-item:nth-child(3) {
        border-right: 1px solid rgba(255, 255, 255, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
      &-item:last-child {
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
    &-footer {
      margin: 20px auto;
      margin-bottom: 25px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
