import App from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { AppFrame } from '../components/AppFrame';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/dist/styles.css';
import '../styles/style.scss';

const theme = {
  colorScheme: 'dark',
  colors: {
    primary: '#28B15C',
  },
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
  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppProvider theme={theme} linkComponent={CustomLinkComponent} features={{ newDesignLanguage: true }}>
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
