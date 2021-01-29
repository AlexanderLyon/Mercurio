import { useState, useCallback } from 'react';
import { Page, Layout, Stack, Collapsible, DisplayText, ButtonGroup, Button } from '@shopify/polaris';
import { MobilePlusMajor, MobileCancelMajor, RefreshMinor } from '@shopify/polaris-icons';
import { StockCard } from '../components/StockCard';
import { AddForm } from '../components/AddForm';

const Dashboard = ({ stockData, autofillOptions, updateStockData }) => {
  const [showingAddForm, setShowingAddForm] = useState(false);
  const toggleAddForm = useCallback(() => setShowingAddForm((showingAddForm) => !showingAddForm), []);

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour >= 17) {
      return 'Good evening!';
    } else if (hour >= 12) {
      return 'Good afternoon!';
    } else if (hour >= 0) {
      return 'Good morning!';
    } else {
      return 'Hi there!';
    }
  };

  const renderStockCards = () =>
    stockData.map((data, i) => {
      if (data) {
        return <StockCard key={i} identifier={i} data={data} unfollowStock={handleRemoveStock} />;
      }
    });

  const handleRemoveStock = (symbol) => {
    const currentlyFollowed = JSON.parse(window.localStorage.getItem('followedSymbols'));
    const stockToRemove = currentlyFollowed.find((obj) => obj.symbol.toLowerCase() == symbol.toLowerCase());
    const indexToRemove = currentlyFollowed.indexOf(stockToRemove);
    currentlyFollowed.splice(indexToRemove, 1);
    window.localStorage.setItem('followedSymbols', JSON.stringify(currentlyFollowed));
    updateStockData();
  };

  return (
    <Page title="Dashboard" fullWidth>
      <Layout>
        <Layout.Section>
          <Stack vertical="true">
            <DisplayText size="large">{greeting()}</DisplayText>
            <ButtonGroup vertical>
              <Button onClick={toggleAddForm} outline icon={showingAddForm ? MobileCancelMajor : MobilePlusMajor}>
                {showingAddForm ? 'Close' : 'Add'}
              </Button>
              <Button onClick={updateStockData} outline icon={RefreshMinor}>
                Refresh
              </Button>
            </ButtonGroup>
            <Collapsible
              open={showingAddForm}
              id="basic-collapsible"
              transition={{ duration: '150ms', timingFunction: 'ease' }}
            >
              <AddForm updateStockData={updateStockData} autofillOptions={autofillOptions} />
            </Collapsible>
            {stockData && (
              <Stack distribution="fillEvenly" wrap="true">
                {renderStockCards()}
              </Stack>
            )}
          </Stack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Dashboard;
