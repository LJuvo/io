<template>
  <Drawer
    v-model="isShow"
    :title="title+' - 实例绑定'"
    inner
    scrollable
    :transfer="false"
    :mask-closable="true"
    placement="right"
    :width="300"
  >
    <Tabs v-model="curTab" @on-click="onTabChanged" size="small">
      <TabPane v-for="rc in reuseClasss" :key="rc.id" :name="rc.keyName" :label="rc.objectName">
        <div
          class="bind-item"
          :class="{'bind-item-select': isSelected(item) }"
          v-for="item in rc.instances"
          :key="item.id"
        >
          {{item.name || item.label}}
          <Button size="small" @click="doBind(item)">{{isSelected(item) ? '解绑' : '绑定'}}</Button>
        </div>
        <div>
          <Button
            icon="md-add"
            @click="create(rc)"
            type="primary"
            style="width: 100%; margin-top: 12px;"
          >添加实例并绑定</Button>
        </div>
      </TabPane>
    </Tabs>
  </Drawer>
</template>

<script>
export default {
  props: ["graph", "hasParent", "item"],
  data() {
    return {
      isShow: false,
      title: "",
      bindCell: {},
      reuseClasss: [], //复用类
      list: [],
      curTab: ""
    };
  },
  computed: {
    resClasses() {
      return _.cloneDeep(this.$store.state.resource.resClasses);
    }
  },
  methods: {
    show(cellData) {
      this.title = cellData.label;
      this.bindCell = cellData;
      this.queryInstances(cellData);
    },
    hide() {
      this.isShow = false;
    },
    setReuseClasss(relateReuses) {
      this.relateReuses = relateReuses;
    },

    create(resClass) {
      // this.hide();
      this.$emit("create-instance", resClass);
    },

    isSelected(item) {
      return item.id === _.get(this.bindCell, "bindData.id", "");
    },

    //复用类切换查询其下的资源实例
    onTabChanged(v) {
      this.curTab = v;
      const resClass = _.find(this.reuseClasss, { keyName: v });
      if (resClass.instances) return; //如果已获取则不请求

      const itemType = _.get(this.item, "type", "");
      let conditions = [];
      if (itemType === "floor") {
        //如果是楼层，则需按楼层进行过滤
        conditions.push({ name: "region", op: "eq", value: this.item.id });
      }
      this.$http({
        method: "POST",
        url: "resource/v1/resource/dynamicTables/list",
        data: {
          resourceClassId: resClass.id,
          searchParas: {
            conditions
          }
        },
        showSpin: false
      }).then(result => {
        if (result) {
          this.$set(resClass, "instances", result.list);
        }
      });
    },

    //查询扩展类下所有的复用类
    queryInstances(cellData) {
      const resourceClassId = cellData.resourceClassId;
      //根据资源类id获取资源实例
      if (resourceClassId) {
        const id = parseInt(resourceClassId);

        //假如是扩展类节点，需要获取下面复用类分类情况
        if (cellData.isExtendClass) {
          if (this.hasParent) {
            this.reuseClasss = _.filter(this.resClasses, rc => {
              return (
                rc.parentId === id &&
                _.find(this.relateReuses, { keyName: rc.keyName })
              );
            });
          } else {
            this.reuseClasss = _.filter(this.resClasses, { parentId: id });
          }

          //默认加载第一个复用类的实例
          if (this.reuseClasss.length > 0) {
            this.onTabChanged(this.reuseClasss[0].keyName);
            this.isShow = true;
          }
        } else {
          this.reuseClasss = _.filter(this.resClasses, {
            keyName: cellData.keyName
          });
          this.onTabChanged(cellData.keyName);
          this.isShow = true;
        }
      } else {
        // this.$Message.info("未建资源类！");
      }
    },

    doBind(item, forceBind) {
      const cell = this.graph.getSelectionCell();
      if (!forceBind && this.isSelected(item)) {
        this.$set(cell.data, "bindData", null);
        cell.setId(this.graph.model.createId(cell));
        this.graph.model.setValue(cell, cell.data.label);
      } else {
        this.$set(cell.data, "bindData", item);
        cell.setId(item.id);
        this.graph.model.setValue(cell, item.name || item.label);
      }
      this.hide();
      this.$emit("bind-success", cell);
    },

    //保存实例后并绑定
    saveAndBind(item) {
      if (!item) return;
      const resClass = _.find(this.reuseClasss, {
        keyName: item.resource_class_keyname
      });
      if (resClass) {
        if (resClass.instances) {
          let findItemIndex = _.findIndex(resClass.instances, { id: item.id });
          if (findItemIndex > -1) {
            resClass.instances.splice(findItemIndex, 1, item);
          } else {
            resClass.instances.unshift(item);
          }
        } else {
          resClass.instances = [item];
        }
        this.doBind(item, true);
      } else {
        //不查数据直接编辑保存的情况
        this.doBind(item, true);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@primary-color : #0cbabd;

.bind-item {
  padding: 5px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-select {
    background: @primary-color;
    color: white;
  }
}
</style>
