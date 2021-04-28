<template>
  <div id="app">
    <div class="page" v-if="titlebarInited">
      <v-titlebar
        :platform="platform"
        :is-maximizable="isMaximizable"
        :is-minimizable="isMinimizable"
        :is-maximized="isMaximized"
        :isClosable="isClosable"
        :on-close="close"
        :on-maximize="maximize"
        :on-restore="restore"
        :on-minimize="minimize"
      >
        <span slot="title">LevelViewer</span>
        <div slot="menu" class="top-menu">
          <span class="top-menu__path" v-if="dbPath">{{ dbPath }}</span>
        </div>
      </v-titlebar>
      <div class="page-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'app',
  data() {
    return {
      titlebarInited: false,
      platform: null,
      isMaximizable: false,
      isMinimizable: false,
      isClosable: false,
      isMaximized: false,
    };
  },
  computed: {
    ...mapState({
      dbPath: (state) => state.dbPath,
    }),
  },
  created() {
    window.ipcRenderer.once('init-titlebar', this.initTitlebar);
    window.ipcRenderer.on('window-is-maximized', (_, status) => {
      this.isMaximized = status;
    });
    window.ipcRenderer.send('do-init-titlebar');
  },
  methods: {
    initTitlebar(e, info) {
      const { platform, isMaximizable, isMinimizable, isClosable } = info;
      this.platform = platform;
      this.isMaximizable = isMaximizable;
      this.isMinimizable = isMinimizable;
      this.isClosable = isClosable;
      this.titlebarInited = true;
    },
    close() {
      window.ipcRenderer.send('titlebar-event', 'close');
    },
    maximize() {
      window.ipcRenderer.send('titlebar-event', 'maximize');
    },
    restore() {
      window.ipcRenderer.send('titlebar-event', 'restore');
    },
    minimize() {
      window.ipcRenderer.send('titlebar-event', 'minimize');
    },
  },
};
</script>

<style lang="less">
:root {
  --text-primary: #2c2c2c;
}

html,
body,
#app,
.page {
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  margin: 0;
  padding: 0;
  background: #f6f6f6;
  position: relative;
}
.page-main {
  width: 100%;
  height: calc(100% - 28px);
}

.top-menu {
  &__path {
    font-size: 13px;
    color: var(--text-primary);
    line-height: 28px;
    -webkit-app-region: drag;
  }
}
</style>
