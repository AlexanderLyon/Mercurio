import { app, nativeTheme } from 'electron';
import serve from 'electron-serve';
import { createWindow, touchBar } from './helpers';

const isProd = process.env.NODE_ENV === 'production';
let initialTheme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    title: 'Mercurio',
    backgroundColor: initialTheme === 'dark' ? '#000000' : '#f6f6f7',
    width: 1000,
    height: 600,
    webPreferences: {
      additionalArguments: [`initialTheme=${initialTheme}`],
    },
  });

  nativeTheme.on('updated', () => {
    const newThemeSetting = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    initialTheme = newThemeSetting;
    mainWindow.webContents.send('theme-change', newThemeSetting);
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    const baseUrl = `http://localhost:${port}`;
    await mainWindow.loadURL(`${baseUrl}/home`);
    mainWindow.webContents.openDevTools();
    mainWindow.setTouchBar(touchBar(mainWindow, baseUrl));
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
