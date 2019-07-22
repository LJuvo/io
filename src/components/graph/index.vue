<template>
  <div class="editor">
    <div class="wrapper">
      <div class="toolbar">
        <Toolbar
          ref="toolbar"
          @back="$emit('back')"
          @up="onUp"
          @expand-changed="onExpandChanged"
          @toggle-layer="onToggleLayer"
        />
      </div>
      <div class="content">
        <div class="left">
          <CompNav ref="nav" />
        </div>
        <div class="right">
          <Workspace
            ref="workspace"
            :item="item"
            @back="$emit('back')"
            @up="onUp"
            @drill="onDrill"
            @on-save="onTopoFileSaved"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "./comps/Toolbar";
import CompNav from "./comps/CompNav";
import Workspace from "./comps/Workspace";
export default {
  name: "Graph",
  props: ["item"],
  components: { CompNav, Workspace, Toolbar },
  data() {
    return {
      splitRatio: "280px",
      data: {}
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    resClasses() {
      return this.$store.state.resource.resClasses;
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        const graph = this.$refs.workspace.getGraph();
        this.$refs.toolbar.initGraph(graph);
        this.$refs.nav.initGraph(graph);

        this.$refs.nav.initRes(null, true);
      });
    },
    initData(data, initResNav = true) {
      this.data = data;
      if (data) {
        this.$refs.workspace.initData(this.data);

        if (initResNav) {
          // if (data.resourceClassId && data.parentId) {
          //   this.fetchDrillRelateResClass({
          //     resource_class_id: data.resourceClassId
          //   });
          // } else {
          this.$refs.nav.initRes(null, true); //放开左侧全部图标
          // }
        }
      }
    },
    onTopoFileSaved(v) {
      this.data = v;
    },
    onDrill(cell) {
      // this.fetchDrillRelateResClass(cell, true);
    },

    getTableName(id) {
      const resClass = _.find(this.resClasses, { id });
      return _.get(resClass, "storageTableName", "");
    },
    fetchTopoFileById(id) {
      this.$http({
        method: "get",
        url: `resource/v1/topoFiles/${id}`
      }).then(result => {
        if (result) {
          this.initData(result);
        }
      });
    },

    //返回上一级
    onUp() {
      if (this.data.parentId) {
        this.fetchTopoFileById(this.data.parentId);
      } else {
        this.$emit("back");
      }
    },
    onExpandChanged(v) {
      this.$refs.workspace.expandAttributePanel(v);
    },
    onToggleLayer() {
      this.$refs.workspace.toggleLayer();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./styles/index.less";
</style>

