<template>
  <div class="nature">
    <div class="nature-pane">
      <div class="nature-pane-title">基础属性</div>
      <div class="nature-pane-content">neirong</div>
    </div>
    <div class="nature-pane">
      <div class="nature-pane-title">基础属性</div>
      <div class="nature-pane-content">neirong</div>
    </div>
    <div class="nature-pane">
      <div class="nature-pane-title">分页符</div>
      <div class="nature-pane-content">
        <div>
          宽度
          <Input v-model="pageWidth" @on-change="onPageSizeChange" />
        </div>
        <div>
          高度
          <Input v-model="pageHeight" @on-change="onPageSizeChange" />
        </div>
        <Button @click="onPageSizeChange">设置分页尺寸</Button>
        <Button @click="onPageBreaks">分页符状态</Button>
        <Button @click="onPageBreaksDash">分页符虚线</Button>
        <Button @click="onPagePrint(graph)">打印分页</Button>
      </div>
    </div>
    <div class="nature-pane">
      <div class="nature-pane-title">页面尺寸</div>
      <div class="nature-pane-content">
        <div v-for="(item,key) in pageFormats" :key="key">
          <span>{{item.key}}-</span>
          <span>{{item.title}}</span>
        </div>
      </div>
    </div>
    <slot name="natureslot"></slot>
  </div>
</template>

<script>
import mxgraph from "../graph/index";
const {
  mxRectangle,
  mxConstants,
  mxPrintPreview,
  mxUtils,
  mxResources
} = mxgraph;
export default {
  data() {
    return {
      graph: null,
      outline: null,
      pageBreaksVisible: false,
      pageBreakDashed: true,
      headerSize: 100,
      footerSize: 100,
      pageWidth: 500,
      pageHeight: 800,
      pageFormats: []
    };
  },
  methods: {
    initGraph(graph) {
      this.graph = graph;
      // this.graph.preferPageSize = true;

      // this.graph.pageFormat.height -= this.headerSize + this.footerSize;
      // this.graph.graphHandler.scaleGrid = false;
      // this.graph.panningHandler.ignoreCell = true;

      this.pageFormats = [
        {
          key: "letter",
          title: 'US-Letter (8,5" x 11")',
          format: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT
        },
        {
          key: "legal",
          title: 'US-Legal (8,5" x 14")',
          format: new mxRectangle(0, 0, 850, 1400)
        },
        {
          key: "tabloid",
          title: "US-Tabloid (279 mm x 432 mm)",
          format: new mxRectangle(0, 0, 1100, 1700)
        },
        {
          key: "a0",
          title: "A0 (841 mm x 1189 mm)",
          format: new mxRectangle(0, 0, 3300, 4681)
        },
        {
          key: "a1",
          title: "A1 (594 mm x 841 mm)",
          format: new mxRectangle(0, 0, 2339, 3300)
        },
        {
          key: "a2",
          title: "A2 (420 mm x 594 mm)",
          format: new mxRectangle(0, 0, 1654, 2336)
        },
        {
          key: "a3",
          title: "A3 (297 mm x 420 mm)",
          format: new mxRectangle(0, 0, 1169, 1654)
        },
        {
          key: "a4",
          title: "A4 (210 mm x 297 mm)",
          format: mxConstants.PAGE_FORMAT_A4_PORTRAIT
        },
        {
          key: "a5",
          title: "A5 (148 mm x 210 mm)",
          format: new mxRectangle(0, 0, 583, 827)
        },
        {
          key: "a6",
          title: "A6 (105 mm x 148 mm)",
          format: new mxRectangle(0, 0, 413, 583)
        },
        {
          key: "a7",
          title: "A7 (74 mm x 105 mm)",
          format: new mxRectangle(0, 0, 291, 413)
        },
        { key: "custom", title: mxResources.get("custom"), format: null }
      ];
    },
    onPageSizeChange() {
      var pw = parseFloat(this.pageWidth);
      var ph = parseFloat(this.pageHeight);

      if (!isNaN(pw) && !isNaN(ph)) {
        this.graph.pageFormat = new mxRectangle(0, 0, pw, ph);
        // this.graph.scrollTileSize = new mxRectangle(0, 0, pw, ph);
      }

      this.graph.pageBreaksVisible = false;
      this.graph.pageBreaksVisible = true;
      this.graph.sizeDidChange();
    },
    onPageBreaks() {
      this.pageBreaksVisible = !this.pageBreaksVisible;
      this.graph.pageBreaksVisible = this.pageBreaksVisible;
      this.graph.sizeDidChange();
    },
    onPageBreaksDash() {
      this.pageBreakDashed = !this.pageBreakDashed;
      this.graph.pageBreaksVisible = false;
      this.graph.sizeDidChange();
      this.graph.pageBreakDashed = this.pageBreakDashed;
      this.graph.pageBreaksVisible = true;
      this.graph.sizeDidChange();
    },
    onPagePrint(graph) {
      var scale = 0.5;

      // Applies scale to page
      var pf = mxRectangle.fromRectangle(
        graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT
      );
      pf.width = Math.round(pf.width * scale * graph.pageScale);
      pf.height = Math.round(pf.height * scale * graph.pageScale);

      // Finds top left corner of top left page
      var bounds = mxRectangle.fromRectangle(graph.getGraphBounds());
      bounds.x -= graph.view.translate.x * graph.view.scale;
      bounds.y -= graph.view.translate.y * graph.view.scale;

      var x0 = Math.floor(bounds.x / pf.width) * pf.width;
      var y0 = Math.floor(bounds.y / pf.height) * pf.height;

      var preview = new mxPrintPreview(graph, scale, pf, 0, -x0, -y0);
      preview.marginTop = this.headerSize * scale * graph.pageScale;
      preview.marginBottom = this.footerSize * scale * graph.pageScale;
      preview.autoOrigin = false;

      var oldRenderPage = preview.renderPage;
      preview.renderPage = function(w, h, x, y, content, pageNumber) {
        var div = oldRenderPage.apply(this, arguments);

        var header = document.createElement("div");
        header.style.position = "absolute";
        header.style.boxSizing = "border-box";
        header.style.fontFamily = "Arial,Helvetica";
        header.style.height = this.marginTop - 10 + "px";
        header.style.textAlign = "center";
        header.style.verticalAlign = "middle";
        header.style.marginTop = "auto";
        header.style.fontSize = "12px";
        header.style.width = "100%";

        // Vertical centering for text in header/footer
        header.style.lineHeight = this.marginTop - 10 + "px";

        var footer = header.cloneNode(true);

        mxUtils.write(header, "Page " + pageNumber + " - Header");
        header.style.borderBottom = "1px solid gray";
        header.style.top = "0px";

        mxUtils.write(footer, "Page " + pageNumber + " - Footer");
        footer.style.borderTop = "1px solid gray";
        footer.style.bottom = "0px";

        div.firstChild.appendChild(footer);
        div.firstChild.appendChild(header);

        return div;
      };

      preview.open();
    }
  }
};
</script>

<style lang="less" scoped>
.nature {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  &-pane {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    &-title {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      background: #efefef;
      padding: 0 10px;
    }
    &-content {
      padding: 5px;
    }
  }
}
</style>
