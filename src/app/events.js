import { dialog, ipcMain } from 'electron';
import { openDatabase } from '../utils/db';

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
    try {
      const db = await openDatabase(opts.path, opts.type);
      console.log(db);
      if (!db) {
        win.webContents.send('db-open-failed', 'error.cannot_locate_db');
        return;
      }
      win.webContents.send('db-opened');
    } catch (err) {
      win.webContents.send('db-open-failed', err.message);
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
