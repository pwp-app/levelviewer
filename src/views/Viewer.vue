<template>
  <div class="viewer">
    <div class="viewer-aside">
      <div class="viewer-aside-title">
        <span>Keys</span>
      </div>
      <div class="viewer-aside-body">
        <virtual-list
          class="viewer-list"
          v-if="listItems.length"
          :data-key="'id'"
          :data-sources="listItems"
          :data-component="keyItem"
        />
        <div class="viewer-list viewer-list-empty" v-else>
          <span>{{ this.$t('viewer.empty') }}</span>
        </div>
      </div>
    </div>
    <div class="viewer-main">
      <div class="viewer-main-title">
        <span>Value</span>
      </div>
      <div class="viewer-main-body">
        <pre v-text="value"></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import VirtualList from 'vue-virtual-scroll-list';
import keyItem from './components/KeyItem';

export default {
  data() {
    return {
      listItems: [],
      keyItem,
      value: '',
      listeners: [],
    };
  },
  components: {
    'virtual-list': VirtualList,
  },
  created() {
    this.listeners.push(
      window.ipcRenderer.on('db-keys', this.handleQueryResult),
      window.ipcRenderer.on('value-gotten', this.handleValueGotten),
    );
    this.queryData();
  },
  beforeDestroy() {
    this.listeners.forEach((listener) => {
      listener.remove();
    });
  },
  methods: {
    queryData() {
      window.ipcRenderer.send('query-keys');
    },
    // ipc events
    handleQueryResult(result) {
      const decoder = new TextDecoder();
      this.listItems = this.listItems.concat(
        result.map((key) => {
          return {
            id: uuidv4(),
            text: decoder.decode(key),
          };
        }),
      );
    },
    handleValueGotten(value) {
      const decoder = new TextDecoder();
      this.value = decoder.decode(value);
    },
  },
};
</script>

<style lang="less">
.viewer {
  width: 100%;
  height: 100%;
  padding: 4px 12px 12px 12px;
  box-sizing: border-box;
  position: relative;
  &-aside {
    float: left;
    width: 240px;
    height: 100%;
    border-right: 1px solid #dfdfdf;
    padding-right: 8px;
    &-title {
      padding-bottom: 8px;
      font-size: 13px;
      line-height: 20px;
      border-bottom: 1px solid #dfdfdf;
      user-select: none;
      color: var(--text-primary);
    }
    &-body {
      height: calc(100% - 65px);
      padding: 8px 0;
      position: relative;
      overflow-y: auto;
      .viewer-list-empty {
        font-size: 13px;
        color: var(--text-primary);
      }
    }
  }
  &-main {
    width: calc(100% - 264px);
    height: 100%;
    float: right;
    position: relative;
    &-title {
      font-size: 13px;
      line-height: 20px;
      border-bottom: 1px solid #dfdfdf;
      padding-bottom: 8px;
      user-select: none;
      color: var(--text-primary);
    }
    &-body {
      width: 100%;
      height: calc(100% - 30px);
      padding-top: 8px;
      box-sizing: border-box;
      position: relative;
      pre {
        width: 100%;
        height: 100%;
        border: 1px solid #dfdfdf;
        margin: 0;
        padding: 12px;
        font-size: 12px;
        font-family: consola;
        box-sizing: border-box;
        color: var(--text-primary);
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-y: auto;
      }
    }
  }
}
</style>
