import { Page, Layout, Stack, DisplayText } from '@shopify/polaris';
import Link from 'next/link';
import { NewsCard } from '../components/NewsCard';

const News = ({ stockData }) => {
  const renderNewsCards = () =>
    stockData.map((data, i) => (
      <Layout.Section key={i}>
        <Stack distribution="fill">
          <DisplayText size="medium">{data.company}</DisplayText>
          {data.articles.map((article, i) => (
            <NewsCard
              key={i}
              headline={article.headline}
              summary={article.summary}
              image={article.image}
              url={article.url}
            />
          ))}
        </Stack>
      </Layout.Section>
    ));

  return (
    <Page title="News" fullWidth>
      <Layout>
        {stockData ? (
          renderNewsCards()
        ) : (
          <div>
            <Link href="/">Start following some stocks</Link> to view related articles!
          </div>
        )}
      </Layout>
    </Page>
  );
};

export default News;
