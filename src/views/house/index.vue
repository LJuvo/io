<template>
  <div class="layout">
    <Layout>
      <Sider ref="sideMenu" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <div class="layout-logo" @click="collapsedSider">
          <Icon :class="rotateIcon" type="md-menu" size="24"></Icon>
        </div>
        <Menu :active-name="activeModel" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="1-1">
            <div class="side-menu-item" @click="activeModel = '1-1'">
              <Icon type="ios-navigate"></Icon>
              <span>D3图库</span>
            </div>
          </MenuItem>
          <MenuItem name="1-2">
            <div class="side-menu-item" @click="activeModel = '1-2'">
              <Icon type="ios-search"></Icon>
              <span>Option 2</span>
            </div>
          </MenuItem>
          <MenuItem name="1-3">
            <div class="side-menu-item" @click="activeModel = '1-3'">
              <Icon type="ios-settings"></Icon>
              <span>Option 3</span>
            </div>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Content :style="{margin: '0', background: '#f6f6f6', height:'100%'}">
          <div
            v-if="activeModel == '1-1'"
            :style="{width:'100%',height:'100%',display:'flex','flex-direction':'row'}"
          >
            <second-menu>
              <template slot="tipLabel">
                <tip-label :name="'D3图库'"></tip-label>
              </template>
              <template slot="sideMenu">
                <Menu active-name="1" style="width:100%;background:none;">
                  <MenuGroup title="简单图形库">
                    <MenuItem name="1">
                      <div @click="absModel ='default'">
                        <Icon type="md-document"/>简单柱状图
                      </div>
                    </MenuItem>
                    <MenuItem name="areachart">
                      <div @click="absModel ='areachart'">
                        <Icon type="md-document"/>简单面积图
                      </div>
                    </MenuItem>
                    <MenuItem name="piechart">
                      <div @click="absModel ='piechart'">
                        <Icon type="md-chatbubbles"/>简单饼状图
                      </div>
                    </MenuItem>
                    <MenuItem name="ringchart">
                      <div @click="absModel ='ringchart'">
                        <Icon type="md-chatbubbles"/>简单环状图
                      </div>
                    </MenuItem>
                    <MenuItem name="linechart">
                      <div @click="absModel ='linechart'">
                        <Icon type="md-chatbubbles"/>简单折线图
                      </div>
                    </MenuItem>
                    <MenuItem name="lineIIchart">
                      <div @click="absModel ='lineIIchart'">
                        <Icon type="md-chatbubbles"/>简单折线图II
                      </div>
                    </MenuItem>
                    <MenuItem name="pointschart">
                      <div @click="absModel ='pointschart'">
                        <Icon type="md-chatbubbles"/>简单散点图
                      </div>
                    </MenuItem>
                  </MenuGroup>
                  <MenuGroup title="基础图形库">
                    <MenuItem name="groupedbar">
                      <div @click="absModel ='groupedbar'">
                        <Icon type="md-document"/>组合柱状图
                      </div>
                    </MenuItem>
                    <MenuItem name="stackedbar">
                      <div @click="absModel ='stackedbar'">
                        <Icon type="md-document"/>堆栈柱状图
                      </div>
                    </MenuItem>
                    <MenuItem name="radialstackedbar">
                      <div @click="absModel ='radialstackedbar'">
                        <Icon type="md-document"/>径向堆栈柱状图
                      </div>
                    </MenuItem>
                    <MenuItem name="8">
                      <div @click="absModel ='default'">
                        <Icon type="md-document"/>树状图
                      </div>
                    </MenuItem>
                    <MenuItem name="8">
                      <div @click="absModel ='default'">
                        <Icon type="md-document"/>雷达图
                      </div>
                    </MenuItem>
                    <MenuItem name="8">
                      <div @click="absModel ='default'">
                        <Icon type="md-document"/>标签云图
                      </div>
                    </MenuItem>
                    <MenuItem name="8">
                      <div @click="absModel ='default'">
                        <Icon type="md-document"/>竖向业务合作伙伴图
                      </div>
                    </MenuItem>
                  </MenuGroup>
                  <MenuGroup title="其他图形库">
                    <MenuItem name="3">
                      <div @click="absModel =''">
                        <Icon type="md-heart"/>弦图
                      </div>
                    </MenuItem>
                    <MenuItem name="3">
                      <div @click="absModel =''">
                        <Icon type="md-heart"/>打包图
                      </div>
                    </MenuItem>
                    <MenuItem name="3">
                      <div @click="absModel =''">
                        <Icon type="md-heart"/>中国地图
                      </div>
                    </MenuItem>
                    <MenuItem name="3">
                      <div @click="absModel =''">
                        <Icon type="md-heart"/>力导向图
                      </div>
                    </MenuItem>
                    <MenuItem name="3">
                      <div @click="absModel =''">
                        <Icon type="md-heart"/>泰森多边形
                      </div>
                    </MenuItem>
                  </MenuGroup>
                </Menu>
              </template>
            </second-menu>
            <div :style="{ flex:'1'}">
              <div :style="contentSty">
                <d3-chart-model :routerModel="absModel" :style="boxShadowSty"></d3-chart-model>
              </div>
            </div>
          </div>
          <div v-if="activeModel == '1-2'">2</div>
          <div v-if="activeModel == '1-3'">3</div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import TipLabel from "./comps/tiplabel";
import SecondMenu from "./comps/secondmenu";
import D3ChartModel from "./d3/";
export default {
  components: { SecondMenu, TipLabel, D3ChartModel },
  data() {
    return {
      isCollapsed: true,
      content: "content",
      activeModel: "1-1",
      absModel: "default",
      contentSty: {
        width: "100%",
        height: "100%",
        padding: "10px"
      },
      boxShadowSty: {
        "box-shadow": "3px -2px 10px rgba(201, 201, 201, 0.349019607843137)",
        background: "#ffffff"
      }
    };
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.sideMenu.toggleCollapse();
    },
    onActiveModel(v) {
      this.activeModel = v;
    }
  }
};
</script>

<style lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
.layout-logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.side-menu-item {
  display: flex;
  align-items: center;
  text-align: center;
}
.menu-item span {
  margin-left: 20px;
}
</style>
<style>
.ivu-layout {
  height: 100%;
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  background-color: #ccc;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  background-color: #eee;
}
</style>
