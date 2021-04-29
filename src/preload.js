import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, func) => {
    const subscription = (_, ...args) => func(...args);
    ipcRenderer.on(channel, subscription);
    return {
      remove: () => ipcRenderer.removeListener(channel, subscription),
    };
  },
  once: (channel, func) => {
    ipcRenderer.once(channel, (_, ...args) => func(...args));
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
});
