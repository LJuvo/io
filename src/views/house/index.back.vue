<template>
  <div class="layout">
    <Layout>
      <Sider ref="sideMenu" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <div class="layout-logo" @click="collapsedSider">
          <Icon :class="rotateIcon" type="md-menu" size="24"></Icon>
        </div>
        <Menu :active-name="activeModel" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="1-1">
            <div @click="activeModel = '1-1'">
              <Icon type="ios-navigate"></Icon>
              <span>Option 1</span>
            </div>
          </MenuItem>
          <MenuItem name="1-2">
            <div @click="activeModel = '1-2'">
              <Icon type="ios-search"></Icon>
              <span>Option 2</span>
            </div>
          </MenuItem>
          <MenuItem name="1-3">
            <div @click="activeModel = '1-3'">
              <Icon type="ios-settings"></Icon>
              <span>Option 3</span>
            </div>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Content :style="{margin: '0', background: '#fff', height:'100%'}">
          {{rotateIcon}}
          <div v-if="activeModel == '1-1'">1</div>
          <div v-if="activeModel == '1-2'">2</div>
          <div v-if="activeModel == '1-3'">3</div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
      content: "content",
      activeModel: "1-1"
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
</style>
<style>
.ivu-layout {
  height: 100%;
}
/* .ivu-layout-sider {
  background: #fff;
  color: #333;
}
.ivu-layout-sider-collapsed {
  background: #ff9900;
  color: #fff;
} */
</style>
