const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;



let win = null;
let tray = null;
let isQuitting = false;

app.setAppUserModelId('com.neurokaraoke.app');

const trayIconPath = isDev
  ? path.join(__dirname, 'assets', 'neurokaraoke.ico')
  : path.join(process.resourcesPath, 'assets', 'neurokaraoke.ico');

const windowIconPath = isDev
  ? path.join(__dirname, 'assets', 'neurokaraoke.ico')
  : path.join(process.resourcesPath, 'assets', 'neurokaraoke.ico');

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:neurokaraokeplayer'
    },
    backgroundColor: '#1a1a1a',
    autoHideMenuBar: true,
    icon: windowIconPath
  });

  
win.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'


  
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

