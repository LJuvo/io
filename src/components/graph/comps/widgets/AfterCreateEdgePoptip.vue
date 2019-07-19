<template>
  <div class="acep" :style="style">
    <div style="position: relative;">
      <div>
        <h4>关联</h4>
      </div>
      <div
        class="nav-item"
        v-for="nav in relateNavs"
        :key="nav.passiveResourceClassId"
        @click="addVertex(nav)"
      >
        {{nav.passiveResourceClassName}}
        <span style="float:right; color: gray;">{{nav.relationType}}</span>
      </div>
      <div style="padding: 12px;" v-if="relateNavs.length === 0">未设置关联关系类！</div>
      <Button
        @click="hide"
        icon="md-close"
        type="error"
        shape="circle"
        size="small"
        style="position: absolute; top: 0; right: 0;"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["graph"],
  data() {
    return {
      style: {},
      navs: [],
      relateNavs: [],
      cell: null
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
      const resList = this.resClasses;
      const rank3List = _.filter(
        resList,
        v => v.rank == 3 && v.basicClass === "设备"
      );
      const rank2Ids = _.map(rank3List, "parentId");

      const hasChildrenRank2List = _.filter(resList, v => {
        return v.rank === 2 && rank2Ids.includes(v.id);
      });

      const grouped = _.groupBy(hasChildrenRank2List, "basicClass");
      let list = [];
      _.keys(grouped).forEach(key => {
        list.push({
          type: key,
          children: grouped[key]
        });
      });
      this.navs = list[0].children;
    },
    hide() {
      this.style = { display: "none" };
    },
    show(cell, left, top) {
      this.cell = cell;
      console.log("TCL: show -> show", cell);

      const bindData = _.get(cell, "source.data.bindData", null);

      const resClassId = bindData
        ? bindData.resource_class_id
        : _.get(cell, "source.data.resourceClassId", 0);
      const resClass = _.find(this.resClasses, { id: parseInt(resClassId) });
      this.fetchRelationResClasses(resClass);

      this.style = {
        display: "block",
        top: top + 5 + "px",
        left: left + 5 + "px"
      };
    },
    //获取关系类
    fetchRelationResClasses(resClass) {
      this.relateNavs = [];
      this.$http({
        method: "GET",
        url: `resource/v1/resource/resourceClassRelations/relations/${
          resClass.id
        }`
      }).then(result => {
        this.relateNavs = _.reject(
          result.passiveResourceClasss,
          v => v.relationType === "复用" || v.relationType === "继承"
        );
        this.relateNavs.forEach(relate => {
          const resClass = _.find(this.resClasses, {
            id: relate.passiveResourceClassId
          });
          if (resClass) {
            relate.resClass = {
              id: resClass.id,
              parentId: resClass.parentId,
              keyName: resClass.keyName,
              objectName: resClass.objectName
            };
          }
        });
      });
    },
    addVertex(relation) {
      this.hide();
      this.$emit("add-vertex", relation, this.cell);

      const item = _.find(this.resClasses, {
        id: relation.passiveResourceClassId
      });

      const data = {
        label: relation.passiveResourceClassName,
        resourceClassId: relation.passiveResourceClassId,
        tableName: relation.passiveResourceClassTableName,
        keyName: item.keyName,
        isExtendClass: item.rank === 2
      };
      const parent = this.graph.getDefaultParent();

      //连线终点的坐标
      const { x, y } = this.cell.geometry.targetPoint;
      //起始节点的位置信息
      const {
        x: sourceX,
        y: sourceY,
        width: sourceWidth,
        height: sourceHeight
      } = this.cell.source.geometry;

      const width = 64;
      const height = 64;

      let targetX, targetY;
      //根据连线方向计算终点的坐标位置
      if (y > sourceY + sourceHeight) {
        targetX = x - width * 0.5;
        targetY = y;
      } else if (y < sourceY) {
        targetX = x - width * 0.5;
        targetY = y - height;
      } else {
        if (x < sourceX) {
          targetX = x - width;
          targetY = y - height * 0.5;
        } else {
          targetX = x;
          targetY = y - height * 0.5;
        }
      }

      //连接的都是复用类，如果想用父类的图标得先反查一下
      const parentResClass = _.find(this.resClasses, {
        id: relation.resClass.parentId
      });
      let shapeStyle = "rounded=1;whiteSpace=wrap;html=1;";

      if (parentResClass) {
        const imgSrc = parentResClass.icon || "static/imgs/graph/default.svg";
        shapeStyle =
          "shape=image;html=1;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;image=" +
          imgSrc;
      }

      const vertex = this.graph.insertVertex(
        parent,
        null,
        data.label,
        targetX,
        targetY,
        width,
        height,
        shapeStyle
      );
      vertex.data = data;

      this.cell.data = { relation };
      this.graph.model.setValue(this.cell, relation.relationType);

      //自动连接新节点
      this.graph.connectCell(this.cell, vertex, false);
    }
  }
};
</script>

<style lang="less" scoped>
.acep {
  position: absolute;
  z-index: 9999;
  width: 300px;
  height: 200px;
  overflow: auto;
  border: 1px solid #dfdfdf;
  background: white;
  display: none;
  left: 0;
  top: 0;
}

.nav-item {
  border: 1px solid #efefef;
  padding: 6px 12px;
  cursor: pointer;
}
</style>
