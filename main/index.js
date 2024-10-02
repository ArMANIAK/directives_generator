const { join } = require("path");
const { format } = require("url");

const { BrowserWindow, app, ipcMain, clipboard } = require("electron");
const isDev = require("electron-is-dev");
const prepareNext = require("electron-next");

const chokidar = require('chokidar');

const { loadDictionaries } = require(join(__dirname, '../renderer/services/ExcelActions'));

const dictionaryFilePath = app.isPackaged
  ? join(process.resourcesPath, 'dictionaries', 'dictionaries.xlsx')
  : join(__dirname, '../renderer/dictionaries/dictionaries.xlsx');

app.whenReady().then( async () => {
  await prepareNext("./renderer");

    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
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

ipcMain.on('clipboard-write', (event, text) => {
    clipboard.writeText(text);
});

// Handle requests from the renderer to get the dictionary
ipcMain.handle('get-dict', () => {
    return loadDictionaries(dictionaryFilePath);
});