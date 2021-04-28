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
        <pre></pre>
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
    };
  },
  components: {
    'virtual-list': VirtualList,
  },
  created() {
    window.ipcRenderer.on('db-data', this.handleQueryResult);
    this.queryData();
  },
  methods: {
    queryData() {
      window.ipcRenderer.send('query-keys');
    },
    handleQueryResult(_, result) {
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
    width: 280px;
    height: 100%;
    &-title {
      padding-bottom: 8px;
      font-size: 14px;
      line-height: 20px;
      border-bottom: 1px solid #dfdfdf;
      user-select: none;
    }
    &-body {
      height: calc(100% - 65px);
      padding: 8px 0;
    }
  }
}
</style>
