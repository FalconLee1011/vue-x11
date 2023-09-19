<template>
  <transition :name="visibilityTransition" mode="out-in">
    <div v-if=visibility @click="windowInteracted" ref="window" class="window" :style="windowStyle">
      <div ref="header">
        <div v-if="!hideDefaultHeader" class="header" :style="headerStyle">
          {{ title }}
        </div>
        <slot v-else name="header"></slot>
      </div>
      <transition :name="minimizeTransition" mode="out-in">
        <div v-if=contentVisibility class="content">
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {};
</script>

<script>
export default {
  props: {
    "visibility-transition": {
      type: String,
      default: "fade", 
    }, 
    "minimize-transition": {
      type: String,
      default: "fade", 
    }, 
    "allow-out-of-bound": {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Window",
    },
    "hide-default-header": {
      type: Boolean, 
      default: false, 
    }, 
    "show-close-button":{
      type: Boolean, 
      default: true, 
    }, 
    "close-button-action":{
      type: String, 
      default: "close", 
      validator(v){
        return ['close', 'minize'].includes(v);
      }, 
    }, 
    "header-color": {
      type: String,
      default: null,
    },
    "header-background": {
      type: String,
      default: "#00000090",
    },
    "header-border-radius": {
      type: String,
      default: "0.25em",
    },
    "window-background": {
      type: String,
      default: "#00000010",
    },
    "window-border-radius": {
      type: String,
      default: "0.25em",
    },
    "window-backdrop-blur": {
      type: String,
      default: "5px",
    },
    "default-y": {
      type: String,
      default: null,
    },
    "default-x": {
      type: String,
      default: null,
    },
    "min-width": {
      type: String,
      default: null,
    },
    "min-height": {
      type: String,
      default: null,
    },
    width: {
      type: String,
      default: "fit-content",
    },
    height: {
      type: String,
      default: "fit-content",
    },
    "max-width": {
      type: String,
      default: null,
    },
    "max-height": {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      zIndex: null,
      visibility: true, 
      contentVisibility: true, 
    };
  },
  computed: {
    windowStyle() {
      return `
        min-width: ${this.minWidth};
        min-height: ${(this.contentVisibility) ? this.minHeight : "0px"};
        width: ${this.width};
        height: ${(this.contentVisibility) ? this.height : "0px"};
        max-width: ${this.maxWidth};
        max-height: ${(this.contentVisibility) ? this.maxHeight : "0px"};
        top: ${this.defaultY};
        left: ${this.defaultX};
        z-index: ${this.zIndex};
        background-color: ${this.windowBackground};
        backdrop-filter: blur(${this.windowBackdropBlur});
        border-radius: 0 0 ${this.windowBorderRadius} ${this.windowBorderRadius};
      `;
    },
    headerStyle() {
      return `
        color: ${this.headerColor};
        background-color: ${this.headerBackground};
        border-radius: ${this.windowBorderRadius} ${this.windowBorderRadius} 0 0;
      `;
    },
  },
  methods: {
    setZIndex(index) {
      this.zIndex = index;
    },
    windowInteracted(){
      this.$parent.onWindowInteracted(this);
    }, 
    toggleMinimize(){
      this.contentVisibility = !this.contentVisibility;
    }, 
    toggleVisibility(){
      this.visibility = !this.visibility;
    }, 
    registerDragAction(_this) {
      const handleEl = _this.$refs.header;
      const targetEl = _this.$refs.window;

      let clientX = 0;
      let clientY = 0;

      handleEl.onmousedown = onDragStart;

      function onDragStart(e) {
        clientX = e.clientX;
        clientY = e.clientY;
        document.onmouseup = onDrop;
        document.onmousemove = onDrag;
        _this.windowInteracted();
      }

      function onDrag(e) {
        e.preventDefault();
        const x = clientX - e.clientX;
        const y = clientY - e.clientY;
        clientX = e.clientX;
        clientY = e.clientY;
        let newX = targetEl.offsetTop - y;
        let newY = targetEl.offsetLeft - x;

        // OOB protection
        if (!_this.allowOutOfBound) {
          if (newX < 0) newX = 0;
          if (newY < 0) newY = 0;
          if (newX + targetEl.clientHeight > window.innerHeight)
            newX = window.innerHeight - targetEl.clientHeight;
          if (newY + targetEl.clientWidth > window.innerWidth)
            newY = window.innerWidth - targetEl.clientWidth;
        }

        targetEl.style.top = `${newX}px`;
        targetEl.style.left = `${newY}px`;
        targetEl.style.position = "absolute";
      }

      function onDrop() {
        document.onmousemove = null;
        document.onmouseup = null;
      }
    },
  },
  mounted() {
    this.registerDragAction(this);
  },
};
</script>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: 0.2s;
}
.fade-enter {
  opacity: 0;
  /* transform: translateX(-20vh); */
  transform: scale(0.95);
}
.fade-leave-to {
  opacity: 0;
  /* transform: translateX(20vh); */
  transform: scale(0.95);
}


.window {
  width: fit-content;
  height: fit-content;
  position: absolute;
  box-sizing: border-box;
  pointer-events: all;
}
.window .header {
  padding: 0.25rem 0.5rem;
  cursor: grab;
  width: 100%;
  box-sizing: border-box;
}
.window .content {
  padding: 0.5rem 0.5rem;
  box-sizing: border-box;
  transition: 0.2s;
}
.close-button {
  /* position: absolute;  */
  right: 0.5rem;
  transform: translateY(0.5rem);
  display: block;
  float: right;
  box-sizing: border-box;
  margin-left: 0.5rem;
}
.close-button:hover{
  cursor: pointer;
  filter: brightness(1.5);
}
.close-button::after, 
.close-button::before {
  content: "";
  display: block;
  transform-origin: center;
  width: 1rem;
  height: 0.1rem;
  background: #ddd;
}
.close-button::after{
  transform: rotateZ(45deg) translateX(-0.085rem);
}
.close-button::before{
  transform: rotateZ(-45deg) translateX(-0.085rem);
}
</style>