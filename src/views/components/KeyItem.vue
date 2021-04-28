<template>
  <div class="viewer-list__item">
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
};
</script>

<style lang="less">
.viewer-list__item {
  font-size: 14px;
}
</style>
