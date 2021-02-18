import { useState, useCallback } from 'react';
import {
  Card,
  DataTable,
  Layout,
  Stack,
  ResourceList,
  ResourceItem,
  Subheading,
  TextContainer,
  TextStyle,
  Caption,
  Collapsible,
} from '@shopify/polaris';
import { PlusMinor, MinusMinor } from '@shopify/polaris-icons';
import StockChart from './StockChart';
import { dollar } from '../utils';

export const StockCard = ({ data, unfollowStock, identifier }) => {
  const negativePrice = data.change < 0;
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const toggleExpandedDetails = useCallback(() => setDetailsExpanded((detailsExpanded) => !detailsExpanded), []);

  const renderHeadlines = () => {
    if (data.articles) {
      const headlinesList = data.articles.map((article, i) => ({
        id: i,
        url: article.url,
        headline: article.headline,
        summary: article.summary,
      }));

      if (headlinesList.length) {
        return (
          <Layout>
            <Layout.Section>
              <Stack vertical>
                <Subheading>Latest articles</Subheading>
                <ResourceList
                  resourceName={{ singular: 'customer', plural: 'customers' }}
                  items={headlinesList}
                  renderItem={(item) => (
                    <ResourceItem id={item.id} url={item.url} accessibilityLabel={`Go to article`}>
                      <h3>
                        <TextStyle variation="strong">{item.headline}</TextStyle>
                      </h3>
                      <div>{item.summary}</div>
                    </ResourceItem>
                  )}
                />
              </Stack>
            </Layout.Section>
          </Layout>
        );
      }
    }
  };

  const buildHeadings = (arr) =>
    arr.map((heading, i) => (
      <Subheading key={i}>
        <TextStyle variation="subdued">{heading}</TextStyle>
      </Subheading>
    ));

  return (
    <Card
      sectioned
      title={`${data.company} (${data.symbol})`}
      actions={[
        {
          content: detailsExpanded ? 'Collapse' : 'Expand',
          icon: detailsExpanded ? MinusMinor : PlusMinor,
          onAction: toggleExpandedDetails,
        },
        {
          content: 'Unfollow',
          destructive: true,
          onAction: () => {
            const confirmation = window.confirm(`Are you sure you want to unfollow ${data.company}?`);
            if (confirmation) {
              unfollowStock(data.symbol);
            }
          },
        },
      ]}
    >
      <Stack vertical>
        <Caption>
          <i>Last updated {data.latestTime}</i>
        </Caption>
        <Stack horizontal spacing="extraLoose">
          <TextContainer>
            <Subheading>
              <TextStyle variation="subdued">Latest Price</TextStyle>
            </Subheading>
            <TextStyle variation={negativePrice ? 'negative' : 'positive'}>{dollar(data.latestPrice)}</TextStyle>
          </TextContainer>
          <TextContainer>
            <Subheading>
              <TextStyle variation="subdued">Change Amount</TextStyle>
            </Subheading>
            <TextStyle>{`${dollar(data.change)} (${Number(data.changePercent.toFixed(3))}%)`}</TextStyle>
          </TextContainer>
          <TextContainer>
            <Subheading>
              <TextStyle variation="subdued">Previous Close</TextStyle>
            </Subheading>
            <TextStyle>{dollar(data.previousClose)}</TextStyle>
          </TextContainer>
        </Stack>

        <StockChart symbol={data.symbol} data={data.hourly} isNegative={negativePrice} identifier={identifier} />

        <Collapsible
          open={detailsExpanded}
          id="basic-collapsible"
          transition={{ duration: '150ms', timingFunction: 'ease' }}
        >
          <Stack vertical>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
              headings={buildHeadings(['Latest Price', 'Change Amt', 'Change %', 'High', 'Low', 'Previous Close'])}
              rows={[
                [
                  dollar(data.latestPrice),
                  dollar(data.change),
                  `${Number(data.changePercent.toFixed(3))}%`,
                  dollar(data.high),
                  dollar(data.low),
                  dollar(data.previousClose),
                ],
              ]}
            />
            {renderHeadlines()}
          </Stack>
        </Collapsible>
      </Stack>
    </Card>
  );
};
