<template>
  <Drawer
    inner
    :transfer="false"
    :mask="false"
    :mast-closable="false"
    :closable="false"
    v-model="isShow"
  >
    <Tabs>
      <TabPane name="data" label="信息">
        <div v-if="isBind">
          <field-view ref="fieldView" :data="fields" border></field-view>
          <ButtonGroup style="width: 100%;">
            <Button
              icon="ios-create"
              @click="$emit('on-edit', item)"
              type="primary"
              style="width: 50%; margin-top: 12px;"
            >编辑</Button>
            <Button
              icon="md-link"
              @click="$emit('on-bind', item)"
              type="primary"
              ghost
              style="width: 50%; margin-top: 12px;"
            >更改绑定</Button>
          </ButtonGroup>
        </div>
        <div v-else>
          <div v-if="hasResClass">
            <Alert type="warning">未绑定实例！</Alert>
            <Button
              icon="md-link"
              @click="$emit('on-bind', item)"
              type="primary"
              style="width: 100%; margin-top: 12px;"
            >绑定实例</Button>
          </div>
          <div v-else>
            <div v-if="relations.length > 0">
              <attritem title="可选关系">
                <Select v-model="relation" @on-change="onRelationChanged" closeable>
                  <Option
                    v-for="relation in relations"
                    :key="relation"
                    :value="relation"
                  >{{relation}}</Option>
                </Select>
              </attritem>
            </div>
            <div v-else>普通连线</div>

            <Button
              style="margin: 5%;width: 90%;"
              v-if="hasTwoInstance"
              type="primary"
              size="small"
              @click="createRelation"
            >关系管理</Button>
          </div>
        </div>
      </TabPane>
      <TabPane name="style" label="样式">
        <Divider style="font-size: 12px">连线</Divider>
        <div style="display:flex; flex-wrap: wrap;">
          <Select
            size="small"
            style="width: 70px;"
            v-model="edgeStyle.pattern"
            transfer
            @on-change="onEdgePatternChanged"
          >
            <Option v-for="item in edgePatterns" :key="item.name" :value="item.name">{{item.label}}</Option>
          </Select>&nbsp;&nbsp;
          <Select
            size="small"
            style="width: 70px;"
            v-model="edgeStyle.shape"
            transfer
            @on-change="onEdgeShapeChanged"
          >
            <Option v-for="item in edgeShapes" :key="item.name" :value="item.name">{{item.label}}</Option>
          </Select>&nbsp;&nbsp;
          <InputNumber
            size="small"
            style="width: 60px;"
            :max="50"
            :formatter="value => `${value}px`"
            @on-change="onStyleChanged($event, 'size')"
            v-model="edgeStyle.size"
          />&nbsp;&nbsp;
          <Select
            size="small"
            style="width: 70px; margin-top: 5px;"
            v-model="edgeStyle.cornerStyle"
            transfer
            @on-change="onEdgeCornerStyleChanged"
          >
            <Option
              v-for="item in edgeCornerStyles"
              :key="item.name"
              :value="item.name"
            >{{item.label}}</Option>
          </Select>&nbsp;&nbsp;
          <Select
            size="small"
            style="width: 70px; margin-top: 5px;"
            v-model="edgeStyle.style"
            transfer
            @on-change="onEdgeStyleChanged"
          >
            <Option v-for="item in edgeStyles" :key="item.name" :value="item.name">{{item.label}}</Option>
          </Select>&nbsp;&nbsp;
          <ColorPicker
            size="small"
            style="width: 60px; margin-top: 5px;"
            transfer
            v-model="edgeStyle.color"
            recommend
            editable
            alpha
            @on-active-change="onColorChanged"
          />
          <attritem layout="h" title="箭头" titleWidth="40" style="margin-top: 2px;">
            <Select
              size="small"
              style="width: 80px;"
              v-model="edgeStyle.startArrow"
              transfer
              @on-change="onArrowChanged($event, true)"
            >
              <Option v-for="item in arrows" :key="item.name" :value="item.name">{{item.label}}</Option>
            </Select>&nbsp;&nbsp;
            <Select
              size="small"
              style="width: 80px;"
              v-model="edgeStyle.endArrow"
              transfer
              @on-change="onArrowChanged($event, false)"
            >
              <Option v-for="item in arrows" :key="item.name" :value="item.name">{{item.label}}</Option>
            </Select>
          </attritem>
        </div>
        <Divider style="font-size: 12px">文本</Divider>
        <attritem layout="h" title="文本位置">
          <Select
            size="small"
            v-model="labelPositionValue"
            transfer
            @on-change="onLabelPositionChanged"
          >
            <Option v-for="lp in labelPositions" :key="lp.name" :value="lp.name">{{lp.label}}</Option>
          </Select>
        </attritem>
      </TabPane>
    </Tabs>
  </Drawer>
</template>

<script>
import { FIELD_STATE, DISPLAY_TYPE } from "@/components/fields/defines.js";
import { setFieldValue } from "@/components/fields/helper.js";
import mxgraph from "../core/index";
const { mxConstants, mxUtils } = mxgraph;

export default {
  props: ["graph"],
  components: {},
  data() {
    return {
      isShow: false,
      hasResClass: false,
      item: {},
      isBind: false,
      fields: [],
      relations: [],
      relation: "",
      edgeStyle: {
        color: "#333333",
        size: 1,
        cornerStyle: "sharp",
        style: "straight",
        pattern: "line",
        shape: "line",
        startArrow: "none",
        endArrow: "default"
      },
      labelPositionValue: "bottom",
      labelPositions: [
        {
          name: "topLeft",
          label: "左上角",
          value: [
            mxConstants.ALIGN_LEFT,
            mxConstants.ALIGN_TOP,
            mxConstants.ALIGN_RIGHT,
            mxConstants.ALIGN_BOTTOM
          ]
        },
        {
          name: "top",
          label: "顶部",
          value: [
            mxConstants.ALIGN_CENTER,
            mxConstants.ALIGN_TOP,
            mxConstants.ALIGN_CENTER,
            mxConstants.ALIGN_BOTTOM
          ]
        },
        {
          name: "topRight",
          label: "右上角",
          value: [
            mxConstants.ALIGN_RIGHT,
            mxConstants.ALIGN_TOP,
            mxConstants.ALIGN_LEFT,
            mxConstants.ALIGN_BOTTOM
          ]
        },
        {
          name: "left",
          label: "居左",
          value: [
            mxConstants.ALIGN_LEFT,
            mxConstants.ALIGN_MIDDLE,
            mxConstants.ALIGN_RIGHT,
            mxConstants.ALIGN_MIDDLE
          ]
        },
        {
          name: "center",
          label: "居中",
          value: [
            mxConstants.ALIGN_CENTER,
            mxConstants.ALIGN_MIDDLE,
            mxConstants.ALIGN_CENTER,
            mxConstants.ALIGN_MIDDLE
          ]
        },
        {
          name: "right",
          label: "居右",
          value: [
            mxConstants.ALIGN_RIGHT,
            mxConstants.ALIGN_MIDDLE,
            mxConstants.ALIGN_LEFT,
            mxConstants.ALIGN_MIDDLE
          ]
        },
        {
          name: "bottomLeft",
          label: "左下角",
          value: [
            mxConstants.ALIGN_LEFT,
            mxConstants.ALIGN_BOTTOM,
            mxConstants.ALIGN_RIGHT,
            mxConstants.ALIGN_TOP
          ]
        },
        {
          name: "bottom",
          label: "底部",
          value: [
            mxConstants.ALIGN_CENTER,
            mxConstants.ALIGN_BOTTOM,
            mxConstants.ALIGN_CENTER,
            mxConstants.ALIGN_TOP
          ]
        },
        {
          name: "bottomRight",
          label: "右下角",
          value: [
            mxConstants.ALIGN_RIGHT,
            mxConstants.ALIGN_BOTTOM,
            mxConstants.ALIGN_LEFT,
            mxConstants.ALIGN_TOP
          ]
        }
      ],
      edgePatterns: [
        {
          name: "solid",
          label: "实线",
          value: [null, null]
        },
        {
          name: "dashed",
          label: "虚线",
          value: ["1", null]
        }
      ],
      edgeShapes: [
        {
          name: "line",
          label: "直线",
          value: [null, null, null, null]
        },
        {
          name: "link",
          label: "管线",
          value: ["link", null, null, null]
        }
      ],
      edgeCornerStyles: [
        { name: "sharp", label: "直角", value: ["0", null] },
        { name: "rounded", label: "圆角", value: ["1", null] },
        { name: "curved", label: "曲角", value: [null, "1"] }
      ],
      edgeStyles: [
        {
          name: "straight",
          label: "直线",
          keys: [
            mxConstants.STYLE_EDGE,
            mxConstants.STYLE_CURVED,
            mxConstants.STYLE_NOEDGESTYLE
          ],
          value: ["straight", null, null]
        },
        {
          name: "orthogonal",
          label: "正交",
          keys: [
            mxConstants.STYLE_EDGE,
            mxConstants.STYLE_CURVED,
            mxConstants.STYLE_NOEDGESTYLE
          ],
          value: ["orthogonalEdgeStyle", null, null]
        },
        {
          name: "elbow",
          label: "上折",
          keys: [
            mxConstants.STYLE_EDGE,
            mxConstants.STYLE_ELBOW,
            mxConstants.STYLE_CURVED,
            mxConstants.STYLE_NOEDGESTYLE
          ],
          value: ["elbowEdgeStyle", null, null, null]
        },
        {
          name: "elbowv",
          label: "下折",
          keys: [
            mxConstants.STYLE_EDGE,
            mxConstants.STYLE_ELBOW,
            mxConstants.STYLE_CURVED,
            mxConstants.STYLE_NOEDGESTYLE
          ],
          value: ["elbowEdgeStyle", "vertical", null, null]
        },
        {
          name: "curved",
          label: "曲线",
          keys: [
            mxConstants.STYLE_EDGE,
            mxConstants.STYLE_CURVED,
            mxConstants.STYLE_NOEDGESTYLE
          ],

          value: ["orthogonalEdgeStyle", "1", null]
        },
        {
          name: "entityRelation",
          label: "反对角",
          keys: [
            mxConstants.STYLE_EDGE,
            mxConstants.STYLE_CURVED,
            mxConstants.STYLE_NOEDGESTYLE
          ],

          value: ["entityRelationEdgeStyle", null, null]
        }
      ],

      arrows: [
        {
          name: "none",
          label: "无箭头",
          value: [mxConstants.NONE]
        },
        {
          name: "classic",
          label: "默认",
          value: [mxConstants.ARROW_CLASSIC]
        },
        {
          name: "block",
          label: "填充形",
          value: [mxConstants.ARROW_BLOCK]
        },
        {
          name: "open",
          label: "开放形",
          value: [mxConstants.ARROW_OPEN]
        },

        {
          name: "oval",
          label: "圆形",
          value: [mxConstants.ARROW_OVAL]
        },
        {
          name: "diamond",
          label: "菱形",
          value: [mxConstants.ARROW_DIAMOND]
        }
      ]
    };
  },
  computed: {
    resClasses() {
      return _.cloneDeep(this.$store.state.resource.resClasses);
    },
    hasTwoInstance() {
      const { source, target } = this.item;
      const sourceData = _.get(source, "data.bindData", null);
      const targetData = _.get(target, "data.bindData", null);

      return sourceData && targetData;
    }
  },
  methods: {
    hide() {
      this.isShow = false;
    },
    setItem(v) {
      this.item = v;
      this.isShow = true;
      this.initStyle(v);
      if (!this.graph.isCellSelected(v)) {
        this.graph.setSelectionCell(v);
      }

      this.relations = [];
      this.relation = _.get(v, "data.relation.relationType", "");
      this.judgeRelate(v);

      //如果是普通连线，则不需要绑定实例
      this.hasResClass = _.get(v, "data.resourceClassId", null);
      const hasBindData = _.get(v, "data.bindData", null);
      if (hasBindData) {
        this.isBind = true;
        const resId = parseInt(v.data.resourceClassId);
        const resClass = _.find(this.resClasses, { id: resId });
        this.initFields(resClass);
        this.graph.setEdgeFlow(v);
      } else {
        this.isBind = false;
      }
    },

    //判断边的两端是否有关系
    judgeRelate(cell) {
      const { source, target } = cell;
      const sourceData = _.get(source, "data.bindData", null);
      const targetData = _.get(target, "data.bindData", null);
      if (sourceData && targetData) {
        const sourceResClassId = sourceData.resource_class_id;
        const targetResClassId = targetData.resource_class_id;
        this.$http({
          method: "get",
          url: `resource/v1/resource/resourceClassRelations/getRelationTypes/${sourceResClassId}/${targetResClassId}`,
          showSpin: false
        }).then(result => {
          this.relations = result;
        });
      }
    },

    onRelationChanged(v) {
      this.item.data = {
        relation: {
          relationType: v
        }
      };
      this.graph.model.setValue(this.item, v);
    },

    //建立端子关系
    createRelation() {
      const { source, target } = this.item;
      const sourceData = _.get(source, "data.bindData", null);
      const targetData = _.get(target, "data.bindData", null);
      if (sourceData && targetData) {
        this.$http({
          method: "post",
          url: `resource/v1/resource/resourceRelations/batchGetMakeupResourceList`,
          data: [sourceData.id, targetData.id],
          showSpin: true
        }).then(result => {
          if (result) {
            const from = { cell: sourceData, values: result[sourceData.id] };
            const to = { cell: targetData, values: result[targetData.id] };
            this.graph.openPortLayer(from, to);
          }
        });
      }
    },

    initStyle(v) {
      const style = this.graph.getCellStyle(v);
      console.log("TCL: initStyle -> style", style);

      //pattern
      var edgePattern = mxUtils.getValue(
        style,
        mxConstants.STYLE_DASHED,
        mxConstants.STYLE_DASH_PATTERN
      );

      this.edgeStyle.pattern = edgePattern == 1 ? "dashed" : "solid";

      //shape
      var edgeShape = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, "line");

      this.edgeStyle.shape = edgeShape === "line" ? "line" : "link";

      //size
      var edgeSize = mxUtils.getValue(
        style,
        mxConstants.STYLE_STROKEWIDTH,
        "2px"
      );

      this.edgeStyle.size = edgeSize;

      //cornstyle
      var rounded = mxUtils.getValue(style, mxConstants.STYLE_ROUNDED, "1");
      var curved = mxUtils.getValue(style, mxConstants.STYLE_CURVED, "1");
      if (rounded == "1") {
        this.edgeStyle.cornerStyle = "rounded";
      } else if (curved == "1") {
        this.edgeStyle.cornerStyle = "curved";
      } else {
        this.edgeStyle.cornerStyle = "straight";
      }

      //style
      var edge = mxUtils.getValue(
        style,
        mxConstants.STYLE_EDGE,
        "orthogonalEdgeStyle"
      );
      if (edge == "straight") {
        this.edgeStyle.style = "straight";
      } else if (edge == "orthogonalEdgeStyle") {
        this.edgeStyle.style = curved == 1 ? "curved" : "orthogonalEdgeStyle";
      } else if (edge == "elbowEdgeStyle") {
        var elbow = mxUtils.getValue(style, mxConstants.STYLE_ELBOW, "null");
        this.edgeStyle.style = elbow == "vertical" ? "elbowv" : "elbow";
      } else if (edge == "entityRelationEdgeStyle") {
        this.edgeStyle.style = "entityRelation";
      }

      //color
      var edgeColor = mxUtils.getValue(
        style,
        mxConstants.STYLE_STROKECOLOR,
        "red"
      );

      this.edgeStyle.color = edgeColor;

      var startArrow = mxUtils.getValue(
        style,
        mxConstants.STYLE_STARTARROW,
        mxConstants.NONE
      );
      this.edgeStyle.startArrow = startArrow;
      var endArrow = mxUtils.getValue(
        style,
        mxConstants.STYLE_ENDARROW,
        mxConstants.ARROW_CLASSIC
      );
      this.edgeStyle.endArrow = endArrow;

      var pos = mxUtils.getValue(
        style,
        mxConstants.STYLE_LABEL_POSITION,
        mxConstants.ALIGN_CENTER
      );
      var vpos = mxUtils.getValue(
        style,
        mxConstants.STYLE_VERTICAL_LABEL_POSITION,
        mxConstants.ALIGN_MIDDLE
      );

      console.log("TCL: initStyle -> pattern", edgePattern, pos, vpos);

      if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_TOP) {
        this.labelPositionValue = "topLeft";
      } else if (
        pos == mxConstants.ALIGN_CENTER &&
        vpos == mxConstants.ALIGN_TOP
      ) {
        this.labelPositionValue = "top";
      } else if (
        pos == mxConstants.ALIGN_RIGHT &&
        vpos == mxConstants.ALIGN_TOP
      ) {
        this.labelPositionValue = "topRight";
      } else if (
        pos == mxConstants.ALIGN_LEFT &&
        vpos == mxConstants.ALIGN_BOTTOM
      ) {
        this.labelPositionValue = "bottomLeft";
      } else if (
        pos == mxConstants.ALIGN_CENTER &&
        vpos == mxConstants.ALIGN_BOTTOM
      ) {
        this.labelPositionValue = "bottom";
      } else if (
        pos == mxConstants.ALIGN_RIGHT &&
        vpos == mxConstants.ALIGN_BOTTOM
      ) {
        this.labelPositionValue = "bottomRight";
      } else if (pos == mxConstants.ALIGN_LEFT) {
        this.labelPositionValue = "left";
      } else if (pos == mxConstants.ALIGN_RIGHT) {
        this.labelPositionValue = "right";
      } else {
        this.labelPositionValue = "center";
      }
    },
    initFields(resClass) {
      let allFields = [];
      if (resClass.baseFileData) {
        const baseFieldJSON = JSON.parse(resClass.baseFileData);
        const baseFields = _.get(baseFieldJSON, "[0].children", []);
        allFields = [...baseFields];
      }
      if (resClass.fileData) {
        const fieldJSON = JSON.parse(resClass.fileData);
        const fields = _.get(fieldJSON, "[0].children", []);
        allFields = [...allFields, ...fields];
      }

      let showFields = allFields.filter(v => v.listDisplay);

      let newItem = {};
      let fields = _.cloneDeep(showFields);
      const bindData = this.item.data.bindData;
      fields.forEach(col => {
        col.attributeGroup = col.attributeGroup || "基础属性";
        col.display = DISPLAY_TYPE.horizontal;
        col.state = FIELD_STATE.readonly;
        if (bindData.hasOwnProperty(col.columnKey)) {
          setFieldValue(col, bindData);
        }
      });

      this.fields = fields;
    },

    onStyleChanged(v, type) {
      this.graph.changeStyle(false, [mxConstants.STYLE_STROKEWIDTH], [v], true);
    },

    onEdgePatternChanged(v) {
      const item = _.find(this.edgePatterns, { name: v });
      const keys = [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN];
      this.graph.changeStyle(false, keys, item.value, true);
    },
    onEdgeCornerStyleChanged(v) {
      const item = _.find(this.edgeCornerStyles, { name: v });
      const keys = [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED];
      this.graph.changeStyle(false, keys, item.value, true);
    },
    onEdgeStyleChanged(v) {
      const item = _.find(this.edgeStyles, { name: v });
      this.graph.changeStyle(false, item.keys, item.value, true);
    },

    onArrowChanged(v, isStart) {
      const item = _.find(this.arrows, { name: v });
      const keys = [
        isStart ? mxConstants.STYLE_STARTARROW : mxConstants.STYLE_ENDARROW
      ];
      this.graph.changeStyle(false, keys, item.value, true);
    },
    onColorChanged(v) {
      this.graph.changeStyle(false, [mxConstants.STYLE_STROKECOLOR], [v], true);
    },
    onEdgeShapeChanged(v) {
      const item = _.find(this.edgeShapes, { name: v });
      const keys = [
        mxConstants.STYLE_SHAPE,
        mxConstants.STYLE_STARTSIZE,
        mxConstants.STYLE_ENDSIZE,
        "width"
      ];
      this.graph.changeStyle(false, keys, item.value, true);
    },
    onLabelPositionChanged(v) {
      const item = _.find(this.labelPositions, { name: v });
      this.graph.getModel().beginUpdate();
      try {
        var vals = item.value;

        if (vals != null) {
          this.graph.setCellStyles(
            mxConstants.STYLE_LABEL_POSITION,
            vals[0],
            this.graph.getSelectionCells()
          );
          this.graph.setCellStyles(
            mxConstants.STYLE_VERTICAL_LABEL_POSITION,
            vals[1],
            this.graph.getSelectionCells()
          );
          this.graph.setCellStyles(
            mxConstants.STYLE_ALIGN,
            vals[2],
            this.graph.getSelectionCells()
          );
          this.graph.setCellStyles(
            mxConstants.STYLE_VERTICAL_ALIGN,
            vals[3],
            this.graph.getSelectionCells()
          );
        }
      } finally {
        this.graph.getModel().endUpdate();
      }
    }
  }
};
</script>

<style>
</style>
