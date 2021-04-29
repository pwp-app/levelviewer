<template>
  <div
    :class="{
      'viewer-list__item': true,
      'viewer-list__item--selected': selected,
    }"
    @click="handleKeyClicked"
  >
    <span :title="source.text">{{ source.text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
    },
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selected: false,
    };
  },
  created() {
    this.$bus.$on('key-selected', this.handleKeySelected);
  },
  beforeDestroy() {
    this.$bus.$off('key-selected', this.handleKeySelected);
  },
  methods: {
    handleKeySelected(key) {
      if (key !== this.source.text) {
        this.selected = false;
      }
    },
    handleKeyClicked() {
      this.$bus.$emit('key-selected', this.source.text);
      this.selected = true;
      window.ipcRenderer.send('query-value', this.source.text);
    },
  },
};
</script>

<style lang="less">
.viewer-list__item {
  width: 100%;
  font-size: 13px;
  padding: 8px 0;
  transition: background-color 100ms ease;
  box-sizing: border-box;
  span {
    width: 100%;
    color: var(--text-primary);
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
    user-select: none;
  }
}
.viewer-list__item:hover {
  background-color: #dfdfdf;
}
.viewer-list__item--selected {
  background-color: #dfdfdf !important;
}
</style>
