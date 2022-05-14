<template>
  <div ref="windowManager" class="window-manager">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    "auto-sort-z-index": {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      windows: [],
    };
  },
  mounted() {
    this.$slots.default.forEach((slot) => {
      const slotComponent = slot.child;
      this.windows.push(slotComponent);
    });
  },
  methods: {
    onWindowInteracted(movedComponent) {
      const layerIndex = this.windows.indexOf(movedComponent);
      if (!this.autoSortZIndex || layerIndex == this.windows.length - 1) {
        return;
      }
      this.windows.splice(layerIndex, 1);
      this.windows.push(movedComponent);
      this.windows.forEach((_window, index) => {
        _window.setZIndex(index);
      });
    },
  },
};
</script>

<style>
.window-manager {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>