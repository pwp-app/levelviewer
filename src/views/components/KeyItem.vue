<template>
  <div
    :class="{
      'viewer-list__item': true,
      'viewer-list__item--selected': selected,
    }"
    @click="handleKeyClicked"
    @contextmenu="handleContextMenu"
  >
    <span :title="decodedKey">{{ decodedKey }}</span>
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
      decoder: new TextDecoder(),
    };
  },
  computed: {
    decodedKey() {
      return this.decoder.decode(this.source.key);
    },
  },
  created() {
    this.$bus.$on('key-selected', this.handleKeySelected);
  },
  beforeDestroy() {
    this.$bus.$off('key-selected', this.handleKeySelected);
  },
  methods: {
    handleKeySelected(key) {
      if (key !== this.decodedKey) {
        this.selected = false;
      }
    },
    handleKeyClicked() {
      this.$bus.$emit('key-selected', this.decodedKey);
      this.selected = true;
      window.ipcRenderer.send('query-value', this.decodedKey);
    },
    handleContextMenu(e) {
      window.ipcRenderer.send('popup-menu', {
        position: {
          x: e.clientX,
          y: e.clientY,
        },
        template: [
          {
            label: this.$t('menu.copy'),
            action: {
              type: 'copy-key',
              key: this.decodedKey,
            },
          },
          {
            action: {
              type: 'delete-key',
              key: this.decodedKey,
            },
            label: this.$t('menu.delete'),
          },
        ],
      });
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
