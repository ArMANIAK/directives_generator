const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  message: {
    send: (payload) => ipcRenderer.send("message", payload),
    on: (handler) => ipcRenderer.on("message", handler),
    off: (handler) => ipcRenderer.off("message", handler),
  },
  ipcRenderer: {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  },
  sendToClipboard: (text) => ipcRenderer.send('clipboard-write', text),
});
