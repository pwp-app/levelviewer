<template>
  <div class="selector-wrapper">
    <div class="selector">
      <div class="selector-desc">
        <span>{{ $t('selector.desc') }}</span>
      </div>
      <div class="selector-main">
        <el-input :readonly="true" v-model="selectedPath"></el-input>
        <el-button @click="selectFolder">{{ $t('selector.select') }}</el-button>
        <el-button
          @click="openDatabase"
          type="primary"
          v-show="selectedPath"
          :loading="openLoading"
        >
          {{ $t('selector.open') }}
        </el-button>
      </div>
      <div class="selector-type">
        <span>{{ $t('selector.type') }}</span>
        <el-dropdown trigger="click" @command="handleTypeChanged">
          <span class="el-dropdown-link">
            {{ DB_NAME_MAP[selectedType] }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="leveldb">LevelDB</el-dropdown-item>
            <el-dropdown-item command="rocksdb">RocksDB</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      DB_NAME_MAP: {
        leveldb: 'LevelDB',
        rocksdb: 'RocksDB',
      },
      selectedType: 'leveldb',
      selectedPath: null,
      openLoading: false,
      listeners: [],
    };
  },
  created() {
    // ipc events
    this.listeners.push(
      window.ipcRenderer.on('dbpath-selected', this.handlePathSelected),
      window.ipcRenderer.on('db-open-failed', this.handleDbOpenFailed),
      window.ipcRenderer.on('db-opened', this.handleDbOpened),
    );
  },
  beforeDestroy() {
    this.listeners.forEach((listener) => {
      listener.remove();
    });
  },
  methods: {
    ...mapMutations(['setDbPath']),
    // ipc events
    handlePathSelected(paths) {
      if (!Array.isArray(paths) || !paths.length) {
        return;
      }
      this.selectedPath = paths[0];
    },
    handleDbOpenFailed(err) {
      if (err.includes('create_if_missing')) {
        this.$message.error({
          message: this.$t('error.cannot_locate_db'),
          offset: 36,
          duration: 2000,
        });
      } else {
        this.$message.error({
          message: this.$t(err),
          offset: 36,
          duration: 2000,
        });
      }
      this.openLoading = false;
    },
    handleDbOpened() {
      this.setDbPath(this.selectedPath);
      this.openLoading = false;
      this.$router.push({
        name: 'viewer',
      });
    },
    // ui events
    handleTypeChanged(type) {
      this.selectedType = type;
    },
    selectFolder() {
      window.ipcRenderer.send('select-folder', this.$t('selector.open.title'));
    },
    openDatabase() {
      if (!this.selectedPath) {
        this.$message.error({
          message: this.$t('selector.error.empty'),
          offset: 36,
          duration: 2000,
        });
        return;
      }
      this.openLoading = true;
      window.ipcRenderer.send('open-database', {
        type: this.selectedType,
        path: this.selectedPath,
      });
    },
  },
};
</script>

<style lang="less">
.selector-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.selector {
  width: 80%;
  margin: 0 auto;
  color: var(--text-primary);
  transform: translateY(-50%);
  user-select: none;
  &-desc {
    margin-bottom: 12px;
    font-size: 15px;
    letter-spacing: 0.05rem;
  }
  &-main {
    display: flex;
    .el-button {
      margin-left: 12px;
    }
  }
  &-type {
    margin-top: 12px;
    display: flex;
    align-items: center;
    color: var(--text-primary);
    font-size: 15px;
    letter-spacing: 0.05rem;
    span {
      margin-right: 12px;
    }
    .el-dropdown {
      cursor: pointer;
    }
  }
}
</style>
