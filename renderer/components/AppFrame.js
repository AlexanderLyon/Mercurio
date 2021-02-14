import React, { useState, useEffect, useCallback } from 'react';
import { Frame, Toast } from '@shopify/polaris';
import { SkeletonLoadingPage } from './Skeleton';
import { Sidebar } from './Sidebar';
import { iexToken } from '../tokens';

export const AppFrame = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stockError, setStockError] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [autofillOptions, setAutofillOptions] = useState([]);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const toggleMobileNavigationActive = useCallback(
    () => setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive),
    []
  );

  const hideError = useCallback(() => setStockError(null), []);

  const assignAutofillOptions = async () => {
    const data = await fetch(`https://cloud.iexapis.com/v1/ref-data/symbols?token=${iexToken}`);
    let formatted = await data.json();
    formatted = formatted.map((obj) => ({
      value: obj.symbol,
      label: obj.name,
    }));

    setAutofillOptions(formatted);
  };

  const getStockNews = async (symbol, type) => {
    if (type == 'stock') {
      const data = await fetch(`https://cloud.iexapis.com/v1/stock/${symbol}/news/last/5?token=${iexToken}`);
      const formatted = await data.json();
      return formatted.filter((article) => article.lang === 'en');
    }
  };

  const getHourlyData = async (symbol, type) => {
    if (type == 'stock') {
      const data = await fetch(`https://cloud.iexapis.com/v1/stock/${symbol}/chart/1d/?token=${iexToken}`);
      return await data.json();
    }
  };

  const getStockData = async (symbol, type) => {
    if (type == 'stock') {
      const data = await fetch(`https://cloud.iexapis.com/v1/stock/${symbol}/quote/?token=${iexToken}`);
      return await data.json();
    }
  };

  const fetchAllStockData = async () => {
    setIsLoading(true);
    const followedSymbols = JSON.parse(window.localStorage.getItem('followedSymbols'));

    if (followedSymbols) {
      const data = await Promise.all(
        followedSymbols.map(async (item) => {
          if (item.type == 'stock') {
            try {
              const formattedData = await getStockData(item.symbol, item.type);
              const formattedHourlyData = await getHourlyData(item.symbol, item.type);
              const formattedNews = await getStockNews(item.symbol, item.type);

              const filteredArr = formattedHourlyData.filter((minute) => {
                if (minute.average) {
                  return minute;
                }
              });

              // Add a formatted timestamp property
              filteredArr.forEach((obj) => {
                obj.timestamp = new Date(`${obj.date}T${obj.minute}`);
              });

              return {
                symbol: formattedData.symbol,
                company: formattedData.companyName,
                marketCap: formattedData.marketCap,
                hourly: filteredArr,
                latestPrice: formattedData.latestPrice,
                latestTime: formattedData.latestTime,
                latestUpdate: formattedData.latestUpdate,
                iexRealtimePrice: formattedData.iexRealtimePrice,
                previousClose: formattedData.previousClose,
                change: formattedData.change,
                changePercent: formattedData.changePercent,
                high: formattedData.high,
                low: formattedData.low,
                week52High: formattedData.week52High,
                week52Low: formattedData.week52Low,
                ytdChange: formattedData.ytdChange,
                isUSMarketOpen: formattedData.isUSMarketOpen,
                articles: formattedNews,
              };
            } catch (error) {
              setStockError(error.message);
              setIsLoading(false);
            }
          }
        })
      );

      if (data) {
        // const marketOpen = (data.openTime > data.closeTime);
        setStockData(data);
      }
    }

    setIsLoading(false);
  };

  // This allows children to be rendered with props
  const renderChildren = React.Children.map(children, (child) =>
    React.cloneElement(child, { stockData, autofillOptions, updateStockData: fetchAllStockData })
  );

  useEffect(() => {
    try {
      fetchAllStockData();
    } catch (error) {
      console.error(`Error fetching stock data`, error);
    }

    try {
      assignAutofillOptions();
    } catch (error) {
      console.error(`Error autofill options`, error);
    }
  }, []);

  return (
    <Frame
      navigation={<Sidebar toggleNav={toggleMobileNavigationActive} />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
    >
      {stockError && (
        <Toast content="Error" onDismiss={hideError}>
          {stockError}
        </Toast>
      )}
      {isLoading ? <SkeletonLoadingPage /> : renderChildren}
    </Frame>
  );
};
