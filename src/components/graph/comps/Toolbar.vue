<template>
  <div id="toolbar">
    <div>
      <Tooltip content="返回">
        <div class="my-cmd" @click="$emit('back')">
          <img src="imgs/toolbar/back.svg" />
        </div>
      </Tooltip>
      <Tooltip content="放大">
        <div class="my-cmd" @click="graph.zoomIn()">
          <img src="imgs/toolbar/zoom_in.svg" />
        </div>
      </Tooltip>
      <Tooltip content="缩小">
        <div class="my-cmd" @click="graph.zoomOut()">
          <img src="imgs/toolbar/zoom_out.svg" />
        </div>
      </Tooltip>
      <span class="separator"></span>
      <Tooltip content="撤销">
        <div class="my-cmd" @click="graph.undo()">
          <img src="imgs/toolbar/undo.svg" />
        </div>
      </Tooltip>
      <Tooltip content="重做">
        <div class="my-cmd" @click="graph.redo()">
          <img src="imgs/toolbar/redo.svg" />
        </div>
      </Tooltip>
      <span class="separator"></span>
      <Tooltip content="导入">
        <Upload
          action
          :format="['xml']"
          accept=".xml"
          :show-upload-list="false"
          :before-upload="handleBeforeUpload"
        >
          <div class="my-cmd">
            <img src="imgs/toolbar/upload.svg" />
          </div>
        </Upload>
      </Tooltip>
      <Tooltip content="导出">
        <div class="my-cmd" @click="graph.export()">
          <img src="imgs/toolbar/download.svg" />
        </div>
      </Tooltip>
      <span class="separator"></span>
      <Tooltip content="组合">
        <div class="my-cmd" @click="graph.group()">
          <img src="imgs/toolbar/group.svg" />
        </div>
      </Tooltip>
      <Tooltip content="解组">
        <div class="my-cmd" @click="graph.ungroup()">
          <img src="imgs/toolbar/ungroup.svg" />
        </div>
      </Tooltip>
      <span class="separator"></span>
      <Tooltip content="放置顶层">
        <div class="my-cmd" @click="graph.orderCells(false)">
          <img src="imgs/toolbar/bring_to_top.svg" />
        </div>
      </Tooltip>
      <Tooltip content="放置底层">
        <div class="my-cmd" @click="graph.orderCells(true)">
          <img src="imgs/toolbar/bring_to_bottom.svg" />
        </div>
      </Tooltip>
      <span class="separator"></span>
      <!-- <Tooltip content="保存">
        <div class="my-cmd" @click="$emit('save')">
          <img src="imgs/toolbar/save.svg">
        </div>
      </Tooltip>-->
      <!-- <Poptip trigger="hover" title="快键键：">
        <div class="my-cmd">
          <img src="imgs/toolbar/help.svg">
        </div>
        <div slot="content">
          <p>delete: 删除选中元素</p>
          <p>ctrl+a: 全选</p>
          <p>ctrl+z: 回退</p>
        </div>
      </Poptip>-->
      <Tooltip content="清空">
        <div class="my-cmd" @click="graph.clear()">
          <img src="imgs/toolbar/clear.svg" />
        </div>
      </Tooltip>
      <Tooltip content="输出XML">
        <div class="my-cmd" @click="graph.logXml()">
          <img src="imgs/toolbar/xml.svg" />
        </div>
      </Tooltip>
      <Tooltip content="上传背景图">
        <div class="my-cmd">
          <img src="imgs/toolbar/bgimg.svg" />
        </div>
      </Tooltip>
      <Tooltip content="画线模式">
        <div
          class="my-cmd"
          :style="{backgroundColor: enableDraw ? '#ddd' : 'transparent'}"
          @click="toggleDraw"
        >
          <img src="imgs/toolbar/draw.svg" />
        </div>
      </Tooltip>
      <Tooltip content="搜索元素">
        <div
          class="my-cmd"
          :style="{backgroundColor: showSearch ? '#ddd' : 'transparent'}"
          @click="toggleSerach"
        >
          <img src="imgs/toolbar/search.svg" />
        </div>
      </Tooltip>
      <span class="separator"></span>
      <!-- <Tooltip content="图层">
        <div class="my-cmd" @click="$emit('toggle-layer')">
          <img src="imgs/toolbar/layer.svg">
        </div>
      </Tooltip>-->
      <Tooltip content="返回上级">
        <div class="my-cmd" @click="$emit('up')">
          <img src="imgs/toolbar/up.svg" />
        </div>
      </Tooltip>
    </div>

    <div>
      <div v-if="isExpand" class="my-cmd" @click="onExpand(false)">
        <img src="imgs/toolbar/less.svg" />
      </div>
      <div v-else class="my-cmd" @click="onExpand(true)">
        <img src="imgs/toolbar/more.svg" />
      </div>
    </div>
    <Select
      v-show="showSearch"
      ref="search"
      filterable
      clearable
      @on-change="doSearch"
      prefix="ios-search"
      placeholder="按元素名称搜索"
      style="position:absolute; top: 50px; left: 280px;width: 200px;"
    >
      <Option
        v-for="item in searchCells"
        :label="item.value"
        :value="item.id"
        :key="item.id"
      >{{ item.value }}</Option>
    </Select>
  </div>
</template>

<script>
export default {
  props: ["isRoot"],
  data() {
    return {
      graph: null,
      isExpand: true,
      showSearch: false,
      searchKey: "",
      searchCells: [],

      enableDraw: false,
      //icon上传参数
      params: {}
    };
  },
  computed: {
    headers() {
      return {
        // Authorization: "Bearer " + this.$ls.get("TOKEN")
      };
    },
    uploadUrl() {
      // return `${this.$config.http.baseURL}fileSystem/upload`;
    }
  },
  methods: {
    initGraph(graph) {
      this.graph = graph;
    },
    handleBeforeUpload(v) {
      this.graph.import(v);
      return false;
    },
    onExpand(v) {
      this.isExpand = v;
      this.$emit("expand-changed", v);
    },
    onBeforeUpload(file) {
      this.params.name = file.name;
    },
    onIconUploadSuccess(v) {
      if (v.hyz_result) {
        const path = v.hyz_result.split("|")[1];
        this.graph.setBgImg(path, 800, 600);
      }
    },
    toggleDraw() {
      this.enableDraw = !this.enableDraw;
      this.graph.toggleDraw(this.enableDraw);
    },
    toggleSerach() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        const cells = this.graph.model.cells;
        this.searchCells = _.filter(cells, v => v.value);
      }
    },
    doSearch(v) {
      const cell = this.graph.model.getCell(v);
      this.graph.setSelectionCell(cell);
    }
  }
};
</script>

<style lang="less" scoped>
@primary-color : #0cbabd;
#toolbar {
  z-index: 3;
  position: fixed;
  display: flex;
  user-select: none;
  justify-content: space-between;
  align-items: center;
  width: calc(~"100% - 48px");
  padding: 0 4px;
}
#toolbar *::before {
  font-size: 16px !important;
}
#toolbar .disable {
  color: #666;
}
#toolbar .icon-select.disable {
  background: #eeeeee;
}
#toolbar .separator {
  margin: 4px;
  padding-top: 8px;
  border-left: 1px solid fade(@primary-color, 50%);
}
#toolbar .command {
  width: 27px;
  height: 27px;
  margin: 0px 6px;
  border-radius: 2px;
  padding-left: 4px;
  display: inline-block;
  border: 1px solid rgba(2, 2, 2, 0);
}
#toolbar .command:nth-of-type(1) {
  margin-left: 24px;
}
#toolbar .command:hover {
  cursor: pointer;
  border: 1px solid fade(@primary-color, 50%);
}
#toolbar .disable:hover {
  cursor: default;
  border: 1px solid rgba(2, 2, 2, 0);
}

.my-cmd {
  width: 27px;
  height: 27px;
  margin: 0px 2px;
  margin-top: 4px;
  border-radius: 2px;
  display: inline-block;
  padding-top: 3px;
  text-align: center;
  border: 1px solid rgba(2, 2, 2, 0);
  &:hover {
    cursor: pointer;
    border: 1px solid fade(@primary-color, 50%);
  }
  img {
    width: 18px;
  }
}
.on-back {
  position: absolute;
  right: 24px;
  top: 10px;
}
.on-up {
  position: absolute;
  right: 110px;
  top: 10px;
}
</style>
