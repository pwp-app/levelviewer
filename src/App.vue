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
          <div class="top-menu-items">
            <div class="top-menu-item" v-if="dbPath" @click="backToSelector">
              <span>{{ $t('menu.open') }}</span>
            </div>
            <div class="top-menu-item" @click="openAbout">
              <span>{{ $t('menu.about') }}</span>
            </div>
          </div>
          <span class="top-menu__path" v-if="dbPath">{{ dbPath }}</span>
        </div>
      </v-titlebar>
      <div class="page-main">
        <router-view></router-view>
      </div>
    </div>
    <About v-if="showAbout" @close="handleAboutClose" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import About from './views/components/About.vue';

export default {
  name: 'app',
  components: {
    About,
  },
  data() {
    return {
      titlebarInited: false,
      platform: null,
      isMaximizable: false,
      isMinimizable: false,
      isClosable: false,
      isMaximized: false,
      showAbout: false,
    };
  },
  computed: {
    ...mapState({
      dbPath: (state) => state.dbPath,
    }),
  },
  created() {
    window.ipcRenderer.once('init-titlebar', this.initTitlebar);
    window.ipcRenderer.on('window-is-maximized', (status) => {
      this.isMaximized = status;
    });
    window.ipcRenderer.send('do-init-titlebar');
  },
  methods: {
    ...mapMutations(['setDbPath']),
    initTitlebar(info) {
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
    backToSelector() {
      if (this.$route.path !== '/') {
        this.$confirm(this.$t('confirm.openNew'))
          .then(() => {
            this.setDbPath(null);
            this.$router.push('/');
          })
          .catch(() => {});
      }
    },
    openAbout() {
      this.showAbout = true;
    },
    handleAboutClose() {
      this.showAbout = false;
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
  width: 100%;
  &__path {
    margin-left: 8px;
    font-size: 13px;
    color: var(--text-primary);
    line-height: 28px;
    -webkit-app-region: drag;
  }
  &-items {
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    display: inline-block;
    .top-menu-item {
      height: 28px;
      display: inline-block;
      padding: 0 6px;
      -webkit-app-region: none;
      span {
        line-height: 28px;
      }
    }
    .top-menu-item:hover {
      background: #d8d8d8;
    }
  }
}
</style>
