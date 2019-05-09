<template>
  <div class="img-grid">
    <div class="img-grid-pane">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
      <img src="../../assets/img/mas.png">
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.img-grid {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 30px 40px;
  background: #ffffff;
  &-pane {
    width: calc(100% - 40px);
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    // grid-template-rows: 120px 120px 120px;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    justify-content: space-between;
    align-content: stretch;
    img {
      width: 100%;
    }
  }
}
@media screen and (max-width: 800px) {
  .img-grid {
    &-pane {
      width: 100%;
      grid-template-columns: 50% 50%;
    }
  }
}
</style>
