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
        <infinite-loading @infinite="infiniteHandler" :identifier="dbPath">
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
import { mapState } from 'vuex';
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
    );
    this.queryData();
  },
  beforeDestroy() {
    this.listeners.forEach((listener) => {
      listener.remove();
    });
  },
  computed: {
    ...mapState({
      dbPath: (state) => state.dbPath,
    }),
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
      const decoder = new TextDecoder();
      this.listItems = this.listItems.concat(
        result.map((key) => {
          return {
            id: uuidv4(),
            text: decoder.decode(key),
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
