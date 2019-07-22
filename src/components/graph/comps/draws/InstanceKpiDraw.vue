<template>
  <Drawer
    v-model="isShow"
    :title="title+' - 指标设置'"
    inner
    scrollable
    :transfer="false"
    :mask-closable="true"
    placement="right"
    :width="300"
  >
    <Collapse simple :value="collapseValue">
      <Panel v-for="group in kpis" :name="group.name" :key="group.name">
        <span class="panel-title">{{group.name}}</span>
        <div slot="content">
          <Checkbox
            v-model="kpi.checked"
            v-for="kpi in group.value"
            :key="kpi.id"
            :label="kpi.kpiKey"
          >
            <span>{{kpi.kpiName}}</span>
          </Checkbox>
        </div>
      </Panel>
    </Collapse>
    <ButtonGroup style="width: 100%;">
      <Button style="width: 50%; margin: 12px 0;" type="primary" ghost @click="hide()">取消</Button>
      <Button style="width: 50%; margin: 12px 0;" type="primary" @click="save">保存</Button>
    </ButtonGroup>
  </Drawer>
</template>

<script>
export default {
  props: ["graph"],
  data() {
    return {
      isShow: false,
      title: "",
      bindCell: {},
      reuseClasss: [], //复用类
      kpis: [],
      collapseValue: []
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
      this.queryKpis(cellData);
    },
    hide() {
      this.isShow = false;
    },

    isSelected(item) {
      return item.id === _.get(this.bindCell, "bindData.id", "");
    },

    //查询指标信息
    queryKpis(cellData) {
      const resourceClassId = _.get(cellData, "bindData.resource_class_id", 0);
      //根据资源类id获取资源实例
      if (resourceClassId) {
        const id = parseInt(resourceClassId);
        this.$http({
          method: "POST",
          url: "resource/v1/resource/commandTemplates/list",
          data: {
            searchParas: {
              conditions: [{ name: "resourceClassId", op: "eq", value: id }]
            }
          },
          showSpin: false
        }).then(result => {
          const cmds = _.get(result, "list", []);
          const kpis = _.uniqBy(_.map(cmds, "kpi"), "id");
          const grouped = _.groupBy(kpis, "kpiType");
          const groupKpis = [];
          const keys = _.keys(grouped);
          keys.forEach(key => {
            groupKpis.push({
              name: key,
              value: grouped[key]
            });
          });
          this.kpis = groupKpis;

          //默认全展开
          this.$nextTick(() => {
            this.collapseValue = keys;
          });

          this.isShow = true;
        });
      }
    },

    save() {
      const cell = this.graph.getSelectionCell();

      const flattenKpis = _.flatten(_.map(this.kpis, "value"));
      const checkedKpis = _.filter(flattenKpis, v => v.checked);
      this.$set(this.bindCell, "kpiData", checkedKpis);

      this.hide();
      // this.$emit("bind-success", cell);
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
