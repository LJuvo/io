<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      pageFormats: [
        {
          key: "letter",
          title: 'US-Letter (8,5" x 11")',
          format: [0, 0, 850, 1100]
        },
        {
          key: "legal",
          title: 'US-Legal (8,5" x 14")',
          format: [0, 0, 850, 1400]
        },
        {
          key: "tabloid",
          title: "US-Tabloid (279 mm x 432 mm)",
          format: [0, 0, 1100, 1700]
        },
        {
          key: "a0",
          title: "A0 (841 mm x 1189 mm)",
          format: [0, 0, 3300, 4681]
        },
        {
          key: "a1",
          title: "A1 (594 mm x 841 mm)",
          format: [0, 0, 2339, 3300]
        },
        {
          key: "a2",
          title: "A2 (420 mm x 594 mm)",
          format: [0, 0, 1654, 2336]
        },
        {
          key: "a3",
          title: "A3 (297 mm x 420 mm)",
          format: [0, 0, 1169, 1654]
        },
        {
          key: "a4",
          title: "A4 (210 mm x 297 mm)",
          format: [0, 0, 827, 1169]
        },
        {
          key: "a5",
          title: "A5 (148 mm x 210 mm)",
          format: [0, 0, 583, 827]
        },
        {
          key: "a6",
          title: "A6 (105 mm x 148 mm)",
          format: [0, 0, 413, 583]
        },
        {
          key: "a7",
          title: "A7 (74 mm x 105 mm)",
          format: [0, 0, 291, 413]
        }
        // { key: "custom", title: mxResources.get("custom"), format: null }
      ]
    };
  }
};
</script>

<style>
</style>
