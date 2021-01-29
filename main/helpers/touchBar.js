import { TouchBar } from 'electron';
const { TouchBarButton } = TouchBar;

const touchBar = (mainWindow, baseUrl) => {
  return new TouchBar({
    items: [
      new TouchBarButton({
        label: '🏠 Dashboard',
        backgroundColor: '#1a8141',
        click: () => {
          mainWindow.loadURL(`${baseUrl}/home`);
        },
      }),
      new TouchBarButton({
        label: '📰 News',
        backgroundColor: '#1a8141',
        click: () => {
          mainWindow.loadURL(`${baseUrl}/news`);
        },
      }),
    ],
  });
};

export default touchBar;
