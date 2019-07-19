<template>
  <Drawer
    inner
    :transfer="false"
    :mask="false"
    :mast-closable="false"
    :closable="false"
    v-model="isShow"
    width="280"
  >
    <Tabs>
      <TabPane name="data" label="数据">
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
          <Alert type="warning">未绑定实例！</Alert>
          <Button
            icon="md-link"
            @click="$emit('on-bind', item)"
            type="primary"
            style="width: 100%; margin-top: 12px;"
          >绑定实例</Button>
        </div>
      </TabPane>
      <TabPane name="style" label="样式">
        <div v-if="!isImage">
          <div style="display:flex; align-items: center;">
            <attritem layout="h" title="填充颜色" titleWidth="50">
              <ColorPicker
                size="small"
                style="width: 42px;"
                transfer
                v-model="fillColor"
                recommend
                editable
                @on-active-change="onFillColorChanged"
              />
            </attritem>
            <attritem layout="h" title="边框颜色" titleWidth="50">
              <ColorPicker
                size="small"
                style="width: 42px;"
                transfer
                v-model="borderColor"
                recommend
                editable
                @on-active-change="onBorderColorChanged"
              />
            </attritem>
          </div>
          <div style="display:flex; align-items: center;">
            <attritem layout="h" title="边框宽度" titleWidth="50">
              <InputNumber
                size="small"
                style="width: 50px"
                :min="0"
                :max="100"
                @on-change="onBorderWidthChanged"
                v-model="borderWidth"
              />
            </attritem>
          </div>
          <attritem layout="h" title="渐变颜色" titleWidth="50">
            <Select
              size="small"
              style="width: 80px;"
              v-model="gradientDirection"
              @on-change="onGradientDirectionChanged"
            >
              <Option value="east">往东</Option>
              <Option value="west">往西</Option>
              <Option value="south">往南</Option>
              <Option value="north">往北</Option>
            </Select>&nbsp;&nbsp;
            <ColorPicker
              size="small"
              style="width: 42px;"
              transfer
              v-model="gradientColor"
              recommend
              editable
              @on-active-change="onGradientColorChanged"
            />
          </attritem>
        </div>

        <Divider style="font-size: 12px">文本</Divider>
        <div style="display:flex; align-items: center;">
          <attritem layout="h" title="位置" titleWidth="30">
            <Select
              size="small"
              v-model="labelPositionValue"
              transfer
              style="width: 80px"
              @on-change="onLabelPositionChanged"
            >
              <Option v-for="lp in labelPositions" :key="lp.name" :value="lp.name">{{lp.label}}</Option>
            </Select>
          </attritem>
          <attritem layout="h" title="大小" titleWidth="30">
            <InputNumber
              size="small"
              style="width: 50px"
              :min="0"
              :max="100"
              @on-change="onTextSizeChanged"
              v-model="textSize"
            />
          </attritem>
        </div>
        <div style="display:flex; align-items: center;">
          <attritem layout="h" title="颜色" titleWidth="30">
            <ColorPicker
              size="small"
              style="width: 45px;"
              transfer
              v-model="textColor"
              recommend
              editable
              @on-active-change="onTextColorChanged"
            />
          </attritem>
          <attritem layout="h" title="背景色" titleWidth="40">
            <ColorPicker
              size="small"
              style="width: 45px;"
              transfer
              v-model="textBgColor"
              recommend
              editable
              @on-active-change="onTextBgColorChanged"
            />
          </attritem>
        </div>

        <div style="display:flex; align-items: center;">
          <attritem layout="h" title="透明度" titleWidth="25">
            <InputNumber
              size="small"
              style="width: 50px"
              :min="0"
              :max="100"
              @on-change="onTextOpacityChanged"
              v-model="textOpacity"
            />
          </attritem>
          <Checkbox v-model="isTextHidden" @on-change="onTextIsHiddenChange">隐藏</Checkbox>
        </div>

        <Divider style="font-size: 12px">形状</Divider>
        <div style="display:flex; align-items: center;">
          <attritem layout="h" title="宽" titleWidth="25">
            <InputNumber
              size="small"
              style="width: 60px"
              @on-change="onVertexWidthChanged"
              v-model="vertexWidth"
            />
          </attritem>
          <attritem layout="h" title="高" titleWidth="25">
            <InputNumber
              size="small"
              style="width: 60px"
              @on-change="onVertexHeightChanged"
              v-model="vertexHeight"
            />
          </attritem>
          <Checkbox v-model="isConstrainSize"/>
        </div>

        <div style="display:flex; align-items: center;">
          <attritem layout="h" title="X" titleWidth="20">
            <InputNumber
              size="small"
              style="width: 60px"
              @on-change="onVertexXChanged"
              v-model="vertexX"
            />
          </attritem>
          <attritem layout="h" title="Y" titleWidth="20">
            <InputNumber
              size="small"
              style="width: 60px"
              @on-change="onVertexYChanged"
              v-model="vertexY"
            />
          </attritem>
        </div>
        <attritem layout="h" title="旋转角度" titleWidth="50">
          <InputNumber
            size="small"
            style="width: 50px"
            @on-change="onVertexRotationChanged"
            v-model="vertexRotation"
          />
        </attritem>
        <div style="display:flex; align-items: center;">
          <attritem layout="h" title="透明度" titleWidth="25">
            <InputNumber
              size="small"
              style="width: 50px"
              :min="0"
              :max="100"
              @on-change="onVertexOpacityChanged"
              v-model="vertexOpacity"
            />
          </attritem>
          <Checkbox v-model="isHidden" @on-change="onVertexIsHiddenChange">隐藏</Checkbox>
        </div>
        <div style="display:flex; align-items: center;">
          <Checkbox v-model="isRounded" @on-change="onVertexIsRoundedChanged">圆角</Checkbox>
          <Checkbox v-model="isShadow" @on-change="onVertexIsShadowChanged">阴影</Checkbox>
          <Checkbox v-model="isGlass" @on-change="onVertexIsGlassChanged">玻璃效果</Checkbox>
        </div>
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
      hasResClass: true,
      item: {},
      isBind: false,
      fields: [],
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

      isImage: true,

      vertexWidth: 64,
      vertexHeight: 64,
      vertexX: 0,
      vertexY: 0,
      isConstrainSize: true,
      vertexRotation: 0,
      vertexOpacity: 100,
      isHidden: false,
      textOpacity: 100,
      isTextHidden: false,

      textColor: "#000",
      textBgColor: "none",
      textSize: 12,

      fillColor: "#fff",
      borderColor: "#000",
      borderWidth: 1,
      gradientDirection: "south",
      gradientColor: "none",

      isRounded: true,
      isShadow: false,
      isGlass: false
    };
  },
  computed: {
    resClasses() {
      return _.cloneDeep(this.$store.state.resource.resClasses);
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
      this.hasResClass = _.get(v, "data.resourceClassId", null);
      const hasBindData = _.get(v, "data.bindData", null);
      if (hasBindData) {
        this.isBind = true;
        const resId = parseInt(v.data.resourceClassId);
        const resClass = _.find(this.resClasses, { id: resId });
        this.initFields(resClass);
      } else {
        this.isBind = false;
      }
    },
    initStyle(v) {
      const style = this.graph.getCellStyle(v);
      console.log("TCL: initStyle -> style", style);

      this.isImage = mxUtils.getValue(style, "shape", "image") === "image";

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

      //init size
      const { x, y, width, height } = v.geometry;
      this.vertexX = x;
      this.vertexY = y;
      this.vertexWidth = width;
      this.vertexHeight = height;

      const rotation = mxUtils.getValue(style, mxConstants.STYLE_ROTATION, 0);
      this.vertexRotation = rotation;
      const opacity = mxUtils.getValue(style, mxConstants.STYLE_OPACITY, 100);
      this.vertexOpacity = opacity;
      this.isHidden = opacity === 0;
      const textOpacity = mxUtils.getValue(
        style,
        mxConstants.STYLE_TEXT_OPACITY,
        100
      );
      this.textOpacity = textOpacity;
      this.isTextHidden = textOpacity === 0;

      this.textColor = mxUtils.getValue(
        style,
        mxConstants.STYLE_FONTCOLOR,
        "#000"
      );
      this.textBgColor = mxUtils.getValue(
        style,
        mxConstants.STYLE_LABEL_BACKGROUNDCOLOR,
        "transparent"
      );
      this.textSize = parseInt(
        mxUtils.getValue(style, mxConstants.STYLE_FONTSIZE, 12)
      );
      this.fillColor = mxUtils.getValue(
        style,
        mxConstants.STYLE_FILLCOLOR,
        "#fff"
      );
      this.borderColor = mxUtils.getValue(
        style,
        mxConstants.STYLE_STROKECOLOR,
        "#000"
      );
      this.borderWidth = mxUtils.getValue(
        style,
        mxConstants.STYLE_STROKEWIDTH,
        1
      );
      this.gradientColor = mxUtils.getValue(
        style,
        mxConstants.STYLE_GRADIENTCOLOR,
        "#fff"
      );
      this.gradientDirection = mxUtils.getValue(
        style,
        mxConstants.STYLE_GRADIENT_DIRECTION,
        "south"
      );
      this.isRounded = mxUtils.getValue(style, mxConstants.STYLE_ROUNDED, 1)
        ? true
        : false;
      this.isShadow = mxUtils.getValue(style, mxConstants.STYLE_SHADOW, 0)
        ? true
        : false;
      this.isGlass = mxUtils.getValue(style, mxConstants.STYLE_GLASS, 0)
        ? true
        : false;
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
    },

    onVertexWidthChanged(v) {
      this.graph.getModel().beginUpdate();
      try {
        let geo = this.graph.getCellGeometry(this.item);
        if (geo) {
          const value = Math.max(1, v);
          geo = geo.clone();
          if (this.isConstrainSize) {
            geo.height =
              Math.round((geo.height * value * 100) / geo.width) / 100;
            this.vertexHeight = geo.height;
          }
          geo.width = value;
          this.graph.getModel().setGeometry(this.item, geo);
        }
      } finally {
        this.graph.getModel().endUpdate();
      }
    },

    onVertexHeightChanged(v) {
      this.graph.getModel().beginUpdate();
      try {
        let geo = this.graph.getCellGeometry(this.item);
        if (geo) {
          const value = Math.max(1, v);
          geo = geo.clone();
          if (this.isConstrainSize) {
            geo.width =
              Math.round((geo.width * value * 100) / geo.height) / 100;
            this.vertexWidth = geo.width;
          }
          geo.height = v;
          this.graph.getModel().setGeometry(this.item, geo);
        }
      } finally {
        this.graph.getModel().endUpdate();
      }
    },

    onVertexXChanged(v) {
      this.graph.getModel().beginUpdate();
      try {
        let geo = this.graph.getCellGeometry(this.item);
        if (geo) {
          geo = geo.clone();
          if (geo.relative) {
            geo.offset.x = v;
          }
          geo.x = v;
          this.graph.getModel().setGeometry(this.item, geo);
        }
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    onVertexYChanged(v) {
      this.graph.getModel().beginUpdate();
      try {
        let geo = this.graph.getCellGeometry(this.item);
        if (geo) {
          geo = geo.clone();
          if (geo.relative) {
            geo.offset.y = v;
          }
          geo.y = v;
          this.graph.getModel().setGeometry(this.item, geo);
        }
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    onVertexRotationChanged(v) {
      this.graph.getModel().beginUpdate();
      try {
        const value = mxUtils.mod(Math.round(v * 100), 36000) / 100;
        this.graph.setCellStyles(
          mxConstants.STYLE_ROTATION,
          value,
          this.graph.getSelectionCells()
        );
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    onVertexIsHiddenChange(v) {
      if (v) {
        this.vertexOpacity = 0;
        this.onVertexOpacityChanged(0);
      } else {
        this.vertexOpacity = 100;
        this.onVertexOpacityChanged(this.vertexOpacity);
      }
    },
    onVertexOpacityChanged(v) {
      this.isHidden = v === 0;
      this.graph.getModel().beginUpdate();
      try {
        this.graph.setCellStyles(
          mxConstants.STYLE_OPACITY,
          v,
          this.graph.getSelectionCells()
        );
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    onTextIsHiddenChange(v) {
      if (v) {
        this.textOpacity = 0;
        this.onTextOpacityChanged(0);
      } else {
        this.textOpacity = 100;
        this.onTextOpacityChanged(this.textOpacity);
      }
    },
    onTextOpacityChanged(v) {
      this.isTextHidden = v === 0;
      this.graph.getModel().beginUpdate();
      try {
        this.graph.setCellStyles(
          mxConstants.STYLE_TEXT_OPACITY,
          v,
          this.graph.getSelectionCells()
        );
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    onTextColorChanged(v) {
      this.graph.getModel().beginUpdate();
      try {
        this.graph.setCellStyles(
          mxConstants.STYLE_FONTCOLOR,
          v,
          this.graph.getSelectionCells()
        );
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    onTextBgColorChanged(v) {
      this.graph.getModel().beginUpdate();
      try {
        this.graph.setCellStyles(
          mxConstants.STYLE_LABEL_BACKGROUNDCOLOR,
          v,
          this.graph.getSelectionCells()
        );
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    onTextSizeChanged(v) {
      this.changeStyle(mxConstants.STYLE_FONTSIZE, v);
    },
    onFillColorChanged(v) {
      this.changeStyle(mxConstants.STYLE_FILLCOLOR, v);
    },
    onBorderColorChanged(v) {
      this.changeStyle(mxConstants.STYLE_STROKECOLOR, v);
    },
    onBorderWidthChanged(v) {
      this.changeStyle(mxConstants.STYLE_STROKEWIDTH, v);
    },
    onGradientColorChanged(v) {
      this.changeStyle(mxConstants.STYLE_GRADIENTCOLOR, v);
    },
    onGradientDirectionChanged(v) {
      this.changeStyle(mxConstants.STYLE_GRADIENT_DIRECTION, v);
    },
    onVertexIsRoundedChanged(v) {
      this.changeStyle(mxConstants.STYLE_ROUNDED, v ? 1 : 0);
    },
    onVertexIsShadowChanged(v) {
      this.changeStyle(mxConstants.STYLE_SHADOW, v ? 1 : 0);
    },
    onVertexIsGlassChanged(v) {
      this.changeStyle(mxConstants.STYLE_GLASS, v ? 1 : 0);
    },
    changeStyle(styleType, value) {
      this.graph.getModel().beginUpdate();
      try {
        this.graph.setCellStyles(
          styleType,
          value,
          this.graph.getSelectionCells()
        );
      } finally {
        this.graph.getModel().endUpdate();
      }
    }
  }
};
</script>

<style>
</style>
