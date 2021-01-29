import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow, touchBar } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    title: 'Mercurio',
    backgroundColor: '#2a2a2b',
    width: 1000,
    height: 600,
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
