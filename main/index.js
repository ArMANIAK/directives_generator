const { join } = require("path");
const { format } = require("url");

const { BrowserWindow, app, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const prepareNext = require("electron-next");

const chokidar = require('chokidar');
const { loadDictionaries } = require('../renderer/utilities/excelActions');

const dictionaryFilePath = app.isPackaged
  ? path.join(app.getAppPath(), 'dictionaries', 'dictionaries.xlsx')
  : path.join(__dirname, '../renderer/dictionaries/dictionaries.xlsx');

app.whenReady().then( async () => {
  await prepareNext("./renderer");

    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
        },
    });

    // Watch for changes in the XLSX file
    const watcher = chokidar.watch(dictionaryFilePath);
    watcher.on('change', () => {
        let dictionaries = loadDictionaries(dictionaryFilePath);
        console.log('Dictionary updated:', dictionaries);

        // Notify the renderer process
        mainWindow.webContents.send('dictionary-updated', dictionaries);
    });

  const url = isDev
    ? "http://localhost:8000"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
    mainWindow.webContents.openDevTools();

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle requests from the renderer to get the dictionary
ipcMain.handle('get-dict', () => {
    return loadDictionaries(dictionaryFilePath);
});