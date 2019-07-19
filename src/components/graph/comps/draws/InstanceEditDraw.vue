<template>
  <div>
    <SaveDrawer
      ref="saveDrawer"
      api="resource/v1/resource/dynamicTables"
      :resClass="resClass"
      @on-save-success="onSaveSuccess"
    />
  </div>
</template>

<script>
import SaveDrawer from "@/components/fields/crud/SaveDrawer";
import { FIELD_STATE, DISPLAY_TYPE } from "@/components/fields/defines.js";
import { setFieldValue } from "@/components/fields/helper.js";

export default {
  props: ["item"],
  components: { SaveDrawer },
  data() {
    return {
      isShow: false,
      resClass: {}
    };
  },
  computed: {
    resClasses() {
      return _.cloneDeep(this.$store.state.resource.resClasses);
    }
  },
  methods: {
    getFields(resClass) {
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

      // let showFields = allFields.filter(v => v.listDisplay);
      let addNeedFields = allFields.filter(v => v.addIsShow);

      let fields = _.cloneDeep(addNeedFields);
      fields.forEach(col => {
        col.attributeGroup = col.attributeGroup || "基础属性";
        col.display = DISPLAY_TYPE.vertical;
        col.state = FIELD_STATE.editable;
        if (col.columnKey === "type") {
          //类型默认自动加
          col.value = resClass.keyName;
          col.state = FIELD_STATE.disabled;
        }
      });
      return fields;
    },
    add(resClass) {
      this.resClass = resClass;
      const fields = this.getFields(resClass);

      //如果是地域组态，初始化地域信息
      const itemType = _.get(this.item, "type", "");
      if (itemType === "floor") {
        const regionField = _.find(fields, { columnKey: "region" });
        if (regionField) {
          const regionData = {
            region: this.item.id,
            region_name: this.item.name,
            region_full_id: `${this.item.parent_id},${this.item.id}`,
            region_full_name: `${this.item.parent_name} / ${this.item.name}`
          };
          setFieldValue(regionField, regionData);
        }
      }

      this.isShow = true;
      this.$nextTick(() =>
        this.$refs.saveDrawer.show({ type: resClass.objectName }, fields)
      );
    },

    edit(cellData) {
      const { bindData } = cellData;
      const resId = bindData.resource_class_id;
      this.resClass = _.find(this.resClasses, { id: resId });
      const fields = this.getFields(this.resClass);
      fields.forEach(field => {
        if (bindData.hasOwnProperty(field.columnKey)) {
          setFieldValue(field, bindData);
        }
      });
      this.isShow = true;
      this.$nextTick(() => this.$refs.saveDrawer.show(bindData, fields));
    },

    onSaveSuccess(v) {
      if (v) {
        this.$emit("save-success", v);
      }
    }
  }
};
</script>

<style>
</style>
