<template>
  <div style="width:100%;height:100%;">
    <img-grid></img-grid>
    <img-content></img-content>
    <img-content offset="right"></img-content>
    <full-page-img></full-page-img>
    <!-- <div style="width:1200px;margin:0 auto;"> -->
    <title-content-img-row></title-content-img-row>
    <title-content-img-row offset="right"></title-content-img-row>
    <!-- </div> -->
  </div>
</template>

<script>
import FullPageImg from "../../components/FullPageImg/";
import TitleContentImgRow from "../../components/TitleContentImgRow/";
import ImgContent from "../../components/ImgContent/";
import ImgGrid from "../../components/ImgGrid/";
export default {
  components: { FullPageImg, TitleContentImgRow, ImgContent, ImgGrid }
};
</script>

<style>
</style>
