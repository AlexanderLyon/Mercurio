import App from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { AppFrame } from '../components/AppFrame';
import { AppProvider } from '@shopify/polaris';
import { ipcRenderer } from 'electron';
import '@shopify/polaris/dist/styles.css';
import '../styles/style.scss';

let colorScheme;

const getInitialTheme = () => {
  const themeArg = process.argv.find((val) => {
    return val.includes('initialTheme') && val.includes('=');
  });

  return themeArg.length ? themeArg.split('=')[1] : 'light';
};

const CustomLinkComponent = ({ as, children, url, external, role, ...rest }) => {
  if (external) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  } else {
    return (
      <Link href={url}>
        <button {...rest}>{children}</button>
      </Link>
    );
  }
};

class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      theme: {
        colorScheme: colorScheme || 'light',
        colors: {
          primary: '#28B15C',
        },
      },
    };
  }

  componentDidMount() {
    if (process.browser) {
      // Set initial theme
      const initialTheme = getInitialTheme();
      this.setState((prevState) => ({
        theme: {
          ...prevState.theme,
          colorScheme: initialTheme,
        },
      }));

      ipcRenderer.on('theme-change', (event, arg) => {
        colorScheme = arg;
        this.setState((prevState) => ({
          theme: {
            ...prevState.theme,
            colorScheme,
          },
        }));
      });
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppProvider theme={this.state.theme} linkComponent={CustomLinkComponent}>
        <Head>
          <title>Mercurio - Stocks and Crypto</title>
          <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
        </Head>
        <AppFrame>
          <Component {...pageProps} />
        </AppFrame>
      </AppProvider>
    );
  }
}

export default MyApp;
