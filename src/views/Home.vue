<template>
  <div>
    <header class="sea-header">
      <div class="sea-header-line"></div>
      <div class="sea-header-content">
        <span class="sea-header-content-studio">STUDIO</span>
        <span class="sea-header-content-sea">BIG SEA</span>
      </div>
      <div class="sea-header-line"></div>
    </header>
    <section class="sea-content">
      <h1 class="sea-content-desc">
        BIGSEA Design is a creative studio where
        <strong>art enthusiast</strong> and
        <strong>tech freaks</strong> connect via
        <span>innovative</span> Ideas.
      </h1>
      <section class="sea-content-pane">
        <div class="sea-content-pane-head">
          <h1 class="sea-content-pane-head-num">01</h1>
          <div class="sea-content-pane-head-info">
            <div class="sea-content-pane-head-info-years">YEARS</div>
            <div class="sea-content-pane-head-info-per">Professional</div>
            <div class="sea-content-pane-head-info-exp">
              Experience
              <i>in</i>
            </div>
          </div>
        </div>
        <div class="sea-content-pane-grid">
          <div class="sea-content-pane-grid-item">
            <a @click="onRouter('/gem')">GEM</a>
          </div>
          <div class="sea-content-pane-grid-item">
            <a @click="onRouter('/house')">Auto</a>
          </div>
          <div class="sea-content-pane-grid-item">
            <a @click="onRouter('/test')">Test</a>
          </div>
        </div>
      </section>
      <div
        class="sea-content-say"
      >We expect to start a long and healthy business relationship with international web design companies,contact us by email(www.704921698@qq.com).</div>
    </section>
  </div>
</template>

<script>
export default {
  methods: {
    onRouter(val) {
      this.$router.push(val);
    }
  }
};
</script>

<style lang="less" scoped>
.sea-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  padding-top: 60px;
  height: 80px;
  line-height: 60px;
  &-line {
    width: 38%;
    height: 30px;
    border-bottom: 1px solid rgb(181, 181, 181);
  }
  &-content {
    display: flex;
    flex-direction: column;
    &-studio {
      font-size: 25px;
      color: rgb(94, 94, 94);
      margin: -26px;
      font-weight: 100;
    }
    &-sea {
      font-size: 45px;
      color: rgb(26, 26, 26);
      margin: -6px;
    }
  }
}
.sea-content {
  width: 500px;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 50px;
  text-align: center;
  &-desc {
    font-size: 16px;
    font-weight: 100;
    color: rgb(110, 108, 110);
    strong {
      font-size: 22px;
      color: rgb(26, 26, 26);
    }
    span {
      font-size: 22px;
      font-weight: 500;
      color: rgb(111, 111, 110);
    }
  }
  &-pane {
    margin: 20px 10px;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-head {
      width: 100%;
      background: #40e0d0;
      background: linear-gradient(to right, #40e0d0, #ff8c00, #ff0080);
      height: 120px;
      color: #ffffff;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      &-num {
        width: 120px;
        line-height: 120px;
        font-size: 40px;
        margin: 0 10px;
      }
      &-info {
        flex: 1;
        text-align: left;
        font-size: 30px;
        padding: 10px;
        margin: 0 10px;
        &-per {
          font-weight: 400;
          margin-top: -12px;
        }
        &-years {
          font-weight: 100;
          font-size: 16px;
          text-align: right;
        }
        &-exp {
          font-weight: 800;
          i {
            font-weight: 100;
            margin-left: 5px;
            font-size: 12px;
          }
        }
      }
    }
    &-grid {
      margin: 20px 0;
      margin-bottom: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      &-item {
        width: 30%;
        background: #000;
        height: 140px;
        line-height: 130px;
        a {
          color: #ffffff;
          font-size: 50px;
          display: inline-block;
          text-decoration: none;
        }
      }
    }
  }
  &-say {
    padding: 20px;
    font-size: 16px;
    font-weight: 100;
    color: rgb(110, 108, 110);
  }
}
@media screen and (max-width: 650px) {
  .sea-header {
    padding-top: 2rem;
    height: 3rem;
    line-height: 2.6rem;
    &-line {
      width: 20%;
      height: 1.3rem;
    }
    &-content {
      &-studio {
        margin: -1rem;
      }
      &-sea {
        margin: 1rem;
      }
    }
  }
  .sea-content {
    width: 90%;
    margin-top: 4rem;
    &-pane {
      margin: 0.5rem;
      margin-bottom: 0;
      &-head {
        width: 100%;
        height: 8rem;
        &-num {
          width: 6rem;
          line-height: 8rem;
          margin: 0;
        }
        &-info {
          padding: 0.8rem 0;
          margin: 0 0.2rem;
          &-years {
            margin-top: 0;
          }
          &-per {
            margin-top: -0.2rem;
          }

          &-exp {
            margin-top: -0.6rem;
            i {
              margin-left: 0.2rem;
            }
          }
        }
      }
      &-grid {
        margin: 1rem 0;
        margin-bottom: 0;
        &-item {
          height: 8rem;
          line-height: 8rem;
          overflow: hidden;
          a {
            font-size: 12rem;
            // font-size: 2rem;
          }
        }
      }
    }
    &-say {
      margin: 0.8rem 0.5rem;
      color: #dddddd;
      background: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
<style>
html {
  /* background: url("../assets/img/bird.png") left top no-repeat; */
}
/* @media screen and (max-width: 650px) {
  html {
    background: url("../assets/img/bird.png") center top no-repeat;
  }
} */
</style>


