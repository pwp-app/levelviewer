/* eslint-disable no-param-reassign */
import { dialog, ipcMain, Menu } from 'electron';
import { openDatabase } from '../utils/db';
import packageInfo from '../../package.json';

let win;
// eslint-disable-next-line no-unused-vars
let currentDb;

const events = {
  'do-init-titlebar': {
    once: true,
    target: () => {
      win.webContents.send('init-titlebar', {
        platform: process.platform,
        isMaximizable: win.isMaximizable(),
        isMinimizable: win.isMinimizable(),
        isClosable: win.isClosable(),
      });
    },
  },
  'titlebar-event': (_, type) => {
    if (type === 'close') {
      win.close();
    } else if (type === 'maximize') {
      if (win.isMaximized()) {
        return;
      }
      win.maximize();
      win.webContents.send('window-is-maximized', true);
    } else if (type === 'restore') {
      if (!win.isMaximized()) {
        return;
      }
      win.unmaximize();
      win.webContents.send('window-is-maximized', false);
    } else if (type === 'minimize') {
      win.minimize();
    }
  },
  'select-folder': async (_, title) => {
    const res = await dialog.showOpenDialog({
      title,
      properties: ['openDirectory', 'showHiddenFiles'],
    });
    win.webContents.send('dbpath-selected', res.filePaths);
  },
  'open-database': async (_, opts) => {
    if (currentDb) {
      currentDb.close();
    }
    try {
      const db = await openDatabase(opts.path, opts.type);
      if (!db) {
        win.webContents.send('db-open-failed', 'error.cannot_locate_db');
        return;
      }
      win.webContents.send('db-opened');
      // eslint-disable-next-line require-atomic-updates
      currentDb = db;
    } catch (err) {
      win.webContents.send('db-open-failed', err.message);
    }
  },
  'query-keys': async (_, opts) => {
    const keys = [];
    const queryOpts = {
      limit: 1000,
    };
    if (opts) {
      if (opts.limit) {
        Object.assign(queryOpts, {
          limit: opts.limit,
        });
      }
      if (opts.bound) {
        Object.assign(queryOpts, {
          gt: opts.bound,
        });
      }
    }
    currentDb
      .createKeyStream(queryOpts)
      .on('data', (data) => {
        keys.push(data);
      })
      .on('end', () => {
        win.webContents.send('db-keys', keys);
      });
  },
  'query-value': async (_, key) => {
    let value;
    try {
      value = await currentDb.get(key);
    } catch (err) {
      if (err.notFound) {
        return;
      }
    }
    win.webContents.send('value-gotten', value);
  },
  'fetch-version': () => {
    win.webContents.send('version', packageInfo.version);
  },
  'popup-menu': (_, opts) => {
    const { position, template } = opts;
    const menu = Menu.buildFromTemplate(
      template.map((item) => {
        if (item.action) {
          const { type } = item.action;
          if (type === 'delete-key') {
            const { key } = item.action;
            item.click = () => {
              win.webContents.send('delete-key', key);
            };
          }
          if (type === 'copy-key') {
            const { key } = item.action;
            item.click = () => {
              win.webContents.send('copy-key', key);
            };
          }
          if (type === 'copy-value') {
            win.webContents.send('copy-value');
          }
          delete item.action;
        }
        return item;
      }),
    );
    menu.popup({
      x: position.x,
      y: position.y,
    });
  },
  'delete-key': async (_, key) => {
    try {
      await currentDb.del(key);
      win.webContents.send('delete-result', {
        type: 'success',
        key,
      });
    } catch (err) {
      win.webContents.send('delete-result', {
        type: 'error',
        err,
      });
    }
  },
};

export const registerEvents = (mainWindow) => {
  win = mainWindow;
  const eventNames = Object.keys(events);
  eventNames.forEach((name) => {
    const handler = events[name];
    if (typeof handler === 'function') {
      ipcMain.on(name, events[name]);
    } else if (typeof handler === 'object') {
      if (handler.once) {
        ipcMain.once(name, handler.target);
      } else {
        ipcMain.on(name, handler.target);
      }
    }
  });
};
