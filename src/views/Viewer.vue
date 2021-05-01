<template>
  <div class="viewer">
    <div class="viewer-aside">
      <div class="viewer-aside-title">
        <span>Keys</span>
      </div>
      <div class="viewer-aside-body custom-scroll">
        <virtual-list
          class="viewer-list"
          :data-key="'id'"
          :data-sources="listItems"
          :data-component="keyItem"
        />
        <infinite-loading @infinite="infiniteHandler" :identifier="identifier">
          <span class="status-text" slot="no-results">{{ $t('loading.noResults') }}</span>
          <span class="status-text" slot="no-more">{{ $t('loading.noMore') }}</span>
        </infinite-loading>
      </div>
    </div>
    <div class="viewer-main">
      <div class="viewer-main-title">
        <span>Value</span>
      </div>
      <div class="viewer-main-body">
        <pre class="custom-scroll" v-text="value"></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import VirtualList from 'vue-virtual-scroll-list';
import keyItem from './components/KeyItem';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      listItems: [],
      keyItem,
      value: '',
      listeners: [],
      identifier: 1,
      selected: '',
    };
  },
  components: {
    'virtual-list': VirtualList,
    InfiniteLoading,
  },
  created() {
    this.listeners.push(
      window.ipcRenderer.on('db-keys', this.handleQueryResult),
      window.ipcRenderer.on('value-gotten', this.handleValueGotten),
      window.ipcRenderer.on('copy-key', this.handleCopyKey),
      window.ipcRenderer.on('delete-key', this.handleDeleteKey),
      window.ipcRenderer.on('delete-result', this.handleDeleteResult),
    );
    this.$bus.$on('key-selected', this.handleKeySelected);
    this.queryData();
  },
  beforeDestroy() {
    this.listeners.forEach((listener) => {
      listener.remove();
    });
  },
  methods: {
    infiniteHandler($state) {
      this.infiniteState = $state;
      this.queryData();
    },
    queryData() {
      window.ipcRenderer.send('query-keys');
    },
    // ipc events
    handleQueryResult(result) {
      this.listItems = this.listItems.concat(
        result.map((key) => {
          return {
            id: uuidv4(),
            key,
          };
        }),
      );
      if (this.listItems.length) {
        this.infiniteState && this.infiniteState.loaded();
      }
      if (this.listItems.length < 1000) {
        this.infiniteState && this.infiniteState.complete();
      }
    },
    handleValueGotten(value) {
      this.value = this.$decoder.decode(value);
    },
    handleCopyKey(key) {
      navigator.clipboard.writeText(key);
    },
    handleDeleteKey(key) {
      this.$confirm(this.$t('confirm.deleteKey').replace('{key}', key))
        .then(() => {
          window.ipcRenderer.send('delete-key', key);
        })
        .catch(() => {});
    },
    handleKeySelected(key) {
      this.selected = key;
    },
    handleDeleteResult(result) {
      if (result.type === 'success') {
        this.identifier += 1;
        this.$set(this, 'listItems', []);
        this.$message.success({
          message: this.$t('delete.success'),
          offset: 36,
          duration: 2000,
        });
        if (result.key === this.selected) {
          this.value = '';
        }
      } else if (result.type === 'error') {
        this.$message.error({
          message: this.$t('delete.error'),
          offset: 36,
          duration: 2000,
        });
        // eslint-disable-next-line no-console
        console.error('Failed to delete key.', result.err);
      }
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
      max-height: calc(100% - 65px);
      padding: 8px 0;
      position: relative;
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

.infinite-status-prompt {
  margin-top: 8px;
  .status-text {
    width: 100%;
    font-size: 12px;
    user-select: none;
  }
}
</style>
