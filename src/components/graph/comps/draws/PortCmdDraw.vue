<template>
  <Drawer
    v-model="isShow"
    :title="title+' - 指令设置'"
    inner
    scrollable
    :transfer="false"
    :mask-closable="true"
    placement="right"
    :width="300"
  >
    <attritem layout="h" title="指令类型">
      <Select v-model="cmdType" @on-change="onCmdTypeChanged">
        <Option v-for="cmd in cmds" :key="cmd.name" :value="cmd.name">{{cmd.name}}</Option>
      </Select>
    </attritem>
    <attritem layout="h" title="可选指令">
      <div v-if="cmdType === 'CTM'">
        <CheckboxGroup v-model="selectCmd[cmdType]">
          <Checkbox v-for="cmd in filterCmds" :key="cmd.id" :label="cmd.enName">
            <span>{{cmd.name}}</span>
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div v-else>
        <RadioGroup v-model="selectCmd[cmdType]">
          <Radio v-for="cmd in filterCmds" :key="cmd.id" :label="cmd.enName">
            <span>{{cmd.name}}</span>
          </Radio>
        </RadioGroup>
      </div>
    </attritem>
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
      cmdType: "",
      filterCmds: [],
      flattenCmds: [],
      cmds: [],
      selectCmd: {}
    };
  },
  computed: {
    resClasses() {
      return _.cloneDeep(this.$store.state.resource.resClasses);
    }
  },
  methods: {
    show(cell) {
      this.title = _.get(cell, "data.bindData.name", "");
      this.bindCell = cell;
      this.queryCmds(cell);
    },
    hide() {
      this.isShow = false;
    },

    initBindCmd() {
      //查看是否已经有绑定指令
      const bindCmds = _.get(
        this.bindCell,
        "data.bindData.commandTemplateList",
        []
      );
      if (bindCmds.length > 0) {
        const bindCmd = bindCmds[0];
        this.cmdType = bindCmd.cmdType;
        this.onCmdTypeChanged(this.cmdType);
        if (this.cmdType === "CTM") {
          this.selectCmd[this.cmdType] = _.map(bindCmds, "cmdEnName");
        } else {
          this.selectCmd[this.cmdType] = bindCmd.cmdEnName;
        }
      } else {
        this.cmdType = "";
        this.selectCmd = {};
        this.filterCmds = [];
      }
    },

    isSelected(item) {
      return item.id === _.get(this.bindCell, "bindData.id", "");
    },

    onCmdTypeChanged(v) {
      if (!v) return;
      this.filterCmds = _.find(this.cmds, { name: v }).value;
    },

    //查询指令信息
    queryCmds(cell) {
      const resourceClassId = _.get(cell, "data.parent.resource_class_id", 0);
      //根据资源类id获取指令模板
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
          this.flattenCmds = cmds;
          const kpis = _.uniqBy(_.map(cmds, "kpi"), "id");
          const grouped = _.groupBy(kpis, "kpiType");
          const groupCmds = [];
          const keys = _.keys(grouped);
          keys.forEach(key => {
            groupCmds.push({
              name: key,
              value: _.filter(cmds, v => _.get(v, "kpi.kpiType", "") === key)
            });
          });
          this.cmds = groupCmds;
          this.initBindCmd();
          this.isShow = true;
        });
      } else {
        this.initBindCmd();
      }
    },

    save() {
      if (!this.cmdType) {
        this.$Message.error("请选择指令！");
        return;
      }

      const cmdEnName = this.selectCmd[this.cmdType];
      if (!cmdEnName) {
        this.$Message.error("请选择指令！");
        return;
      }

      let data = [];

      const { id: portId, name: portName } = _.get(
        this.bindCell,
        "data.bindData",
        {}
      );

      if (this.cmdType === "CTM") {
        cmdEnName.forEach(v => {
          const cmd = _.find(this.flattenCmds, { enName: v });
          data.push({
            cmdType: this.cmdType,
            portId,
            portName,
            cmdId: cmd.id,
            cmdName: cmd.name,
            cmdEnName: v
          });
        });
      } else {
        const cmd = _.find(this.flattenCmds, { enName: cmdEnName });
        data.push({
          cmdType: this.cmdType,
          portId,
          portName,
          cmdId: cmd.id,
          cmdName: cmd.name,
          cmdEnName
        });
      }

      this.$http({
        method: "POST",
        url: "resource/v1/resource/portCommandTemplates/batchadd",
        data
      }).then(result => {
        this.$Message.success("保存成功！");
      });

      this.hide();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/styles/theme";

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
