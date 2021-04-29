<template>
  <div class="about-wrapper" @click="onClose">
    <div class="about" @click.stop.prevent>
      <div class="about-head">
        <p class="about-head-title">LevelViewer<i class="el-icon-close" @click="onClose"></i></p>
        <p class="about-head-version">{{ version }}</p>
      </div>
      <div class="about-footer">
        <p>Made by BackRunner.</p>
        <p>This is an open source project under MIT License.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    window.ipcRenderer.once('version', (_, ver) => {
      this.version = ver;
    });
    window.ipcRenderer.send('fetch-version');
  },
  data() {
    return {
      version: '',
    };
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="less">
.about-wrapper {
  position: fixed;
  background: rgba(0, 0, 0, 0.75);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: flex;
  justify-content: center;
  .about {
    width: 85%;
    margin-top: 120px;
    height: max-content;
    background: #fcfcfc;
    padding: 22px 24px 28px 24px;
    border-radius: 16px;
    box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.25);
    user-select: none;
    &-head {
      padding-bottom: 14px;
      border-bottom: 1px solid #dfdfdf;
      &-title {
        font-size: 20px;
        color: var(--text-primary);
        letter-spacing: 0.1rem;
        margin-bottom: 16px;
        margin-top: 0;
        i {
          float: right;
          transition: color 100ms ease;
        }
        i:hover {
          cursor: pointer;
          color: #999;
        }
      }
      &-version {
        font-size: 14px;
        color: #666;
      }
    }
    &-footer {
      p {
        margin-top: 16px;
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
