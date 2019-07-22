<template>
  <Drawer
    inner
    :transfer="false"
    :mask="false"
    :mast-closable="false"
    :closable="false"
    v-model="show"
  >
    <!-- <div v-if="defaultLayerIsShow">
      <attritem required title="视图名称">
        <Input v-model="item.name"/>
      </attritem>
      <attritem title="背景">
        <div style="display:flex; align-items:center;">
          <ColorPicker
            size="small"
            style="width: 60px;"
            transfer
            v-model="bgColor"
            recommend
            editable
            @on-active-change="onColorChanged"
          />&nbsp;&nbsp;
          <Upload
            ref="upload"
            :show-upload-list="false"
            accept="image/*, *.svg"
            :format="['jpg','jpeg','svg','png']"
            :max-size="20480"
            :headers="headers"
            name="files"
            :data="params"
            :before-upload="onBeforeUpload"
            :on-success="onIconUploadSuccess"
            :action="uploadUrl"
          >
            <Button size="small" type="primary" ghost>选择图片</Button>
          </Upload>
        </div>
      </attritem>
      <attritem title="说明">
        <Input type="textarea" v-model="item.remark"/>
      </attritem>
    </div>
    <ButtonGroup v-if="defaultLayerIsShow" style="width: 100%;">
      <Button style="width: 30%; margin: 12px 0;" type="primary" ghost @click="$emit('up')">取消</Button>
      <Button style="width: 40%; margin: 12px 0;" type="primary" @click="save">保存</Button>
      <Button
        :disabled="!item.id"
        style="width: 30%; margin: 12px 0;"
        type="error"
        @click="() => showDeleteModal = true"
      >{{item.id ? '删除' : '未保存'}}</Button>
    </ButtonGroup>
    <div v-else>
      <h4 style="margin: 12px;">端子关系连接</h4>
      <ButtonGroup style="width: 100%">
        <Button style="width: 50%;" type="primary" ghost @click="onBackDefaultLayer">返回</Button>
        <Button style="width: 50%;" type="primary" @click="savePortRelation">保存关系</Button>
      </ButtonGroup>
    </div>
    <Modal title="删除警告" v-model="showDeleteModal" class-name="vertical-center-modal">
      <Alert type="error">是否真的删除该模型【{{ item ? item.name : "" }}】？</Alert>
      <div slot="footer" style="text-align: center">
        <Button @click="showDeleteModal = false" style="margin-left: 8px">取消</Button>
        <Button type="error" @click="doDel">确定删除</Button>
      </div>
    </Modal>-->
  </Drawer>
</template>

<script>
export default {
  props: ["show", "graph"],
  data() {
    return {
      item: {
        name: "",
        commonGroupId: 0,
        type: "拓扑",
        parentId: "0",
        resourceId: "0",
        remark: ""
      },
      bgColor: "",
      showDeleteModal: false,
      defaultLayerIsShow: true,
      //icon上传参数
      params: {}
    };
  },
  computed: {
    headers() {
      return {
        Authorization: "Bearer " + this.$ls.get("TOKEN")
      };
    },
    uploadUrl() {
      return `${this.$config.http.baseURL}fileSystem/upload`;
    },
    resClasses() {
      return this.$store.state.resource.resClasses;
    }
  },
  methods: {
    init(v) {
      this.item = v;
      this.$nextTick(
        () => (this.bgColor = this.graph.container.style.backgroundColor)
      );
    },

    onColorChanged(v) {
      this.graph.container.style.backgroundColor = v;
    },

    handleBeforeUpload(v) {
      this.graph.import(v);
      return false;
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

    hideDefaultLayer() {
      this.defaultLayerIsShow = false;
    },

    //返回默认图层
    onBackDefaultLayer() {
      this.defaultLayerIsShow = true;
      this.graph.backDefaultLayer();
    },

    //对下钻的元素进行标记，并保存当前视图
    markAndSave() {
      this.graph.markDrill();
      this.save(true);
    },

    save(dontReset) {
      if (this.item.name.trim() === "") {
        this.$Message.error("请输入名称！");
        return;
      }
      this.item.fileData = this.graph.getXML();
      this.$http({
        method: this.item.id ? "put" : "post",
        url: "resource/v1/topoFiles",
        data: this.item,
        showMsg: true
      }).then(result => {
        if (result) {
          if (!dontReset) {
            this.item = result;
            this.$emit("on-save", result);
          }
          this.saveRelate();
        }
      });
    },

    doDel() {
      this.$http({
        method: "delete",
        url: "resource/v1/topoFiles",
        data: [this.item.id],
        showMsg: true
      }).then(result => {
        this.deleteRelate();
        this.$emit("up");
        this.showDeleteModal = false;
      });
    },

    //获取拓扑内所有的关系
    getRelations() {
      const cells = this.graph.getModel().cells;
      let relations = [];
      _.forEach(cells, v => {
        if (v.edge && v.data && v.data.relation && v.source && v.target) {
          relations.push({
            mainResourceId: v.source.id,
            mainResourceName: v.source.value,
            mainResourceTableName: v.source.data.tableName,
            passiveResourceId: v.target.id,
            passiveResourceName: v.target.value,
            passiveResourceTableName: v.target.data.tableName,
            relationType: v.data.relation.relationType
          });
        }

        //如果有父级
        if (this.item.parentId) {
          if (v.vertex && v.data && v.data.bindData) {
            relations.push({
              mainResourceId: v.id,
              mainResourceName: v.value,
              mainResourceTableName: v.data.tableName,
              passiveResourceId: this.item.resourceId,
              passiveResourceName: this.item.resourceName,
              passiveResourceTableName: this.item.resourceTableName,
              relationType: "组成"
            });
          }
        }
      });
      return relations;
    },

    deleteRelate() {
      const relations = this.getRelations();
      if (relations.length === 0) return;
      this.$http({
        method: "post",
        url: "resource/v1/resource/resourceRelations/batchdelete",
        data: relations
      }).then(result => {});
    },

    saveRelate() {
      const relations = this.getRelations();
      if (relations.length === 0) return;
      this.$http({
        method: "post",
        url: "resource/v1/resource/resourceRelations/batchadd",
        data: relations
      }).then(result => {});
    },

    //保存端口关系
    savePortRelation() {
      const cells = _.get(this.graph, "devicePortLayer.children", []);
      let relations = [];
      cells.forEach(cell => {
        const sourceData = _.get(cell, "source.data.bindData", null);
        const targetData = _.get(cell, "target.data.bindData", null);
        if (cell.edge && sourceData && targetData) {
          const mainResClass = _.find(this.resClasses, {
            keyName: sourceData.resource_class_keyname
          });
          const passiveResClass = _.find(this.resClasses, {
            keyName: sourceData.resource_class_keyname
          });
          relations.push({
            mainResourceId: sourceData.id,
            mainResourceName: sourceData.name,
            mainResourceTableName: mainResClass
              ? mainResClass.storageTableName
              : "",
            passiveResourceId: targetData.id,
            passiveResourceName: targetData.name,
            passiveResourceTableName: passiveResClass
              ? passiveResClass.storageTableName
              : "",
            relationType: "连接"
          });
        }
      });
      this.$http({
        method: "post",
        url: "resource/v1/resource/resourceRelations/batchadd",
        data: relations
      }).then(result => {});
    }
  }
};
</script>

<style>
</style>
