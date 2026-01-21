const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

app.setAppUserModelId('com.neurokaraoke.app');

let win = null;
let tray = null;
let isQuitting = false;

const isDev = !app.isPackaged;

const trayIconPath = isDev
  ? path.join(__dirname, 'assets', 'neurokaraoke.ico')
  : path.join(process.resourcesPath, 'assets', 'neurokaraoke.ico');

const windowIconPath = isDev
  ? path.join(__dirname, 'assets', 'neurokaraoke.ico')
  : path.join(process.resourcesPath, 'assets', 'neurokaraoke.ico');

function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 800,
    fullscreenable: false,
    show: true,
    title: 'NeuroKaraoke',
    icon: windowIconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('https://www.neurokaraoke.com')) {
      event.preventDefault();
    }
  });

  win.webContents.on('before-input-event', (event, input) => {
    if (input.control || input.meta) {
      event.preventDefault();
    }
  });

  win.setMenuBarVisibility(false);
  win.loadURL('https://www.neurokaraoke.com/');
}

function createTray() {
  tray = new Tray(trayIconPath);
  tray.setToolTip('NeuroKaraoke');

  const menu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        if (!win || win.isDestroyed()) {
          createWindow();
        }
        win.show();
        win.focus();
      }
    },
    {
      label: 'Exit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);

  tray.on('click', () => {
    if (win && !win.isDestroyed()) {
      win.isVisible() ? win.hide() : win.show();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {

});
