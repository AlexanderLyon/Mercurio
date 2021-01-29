import { Card, Link, Heading, TextContainer } from '@shopify/polaris';

export const NewsCard = ({ headline, summary, url }) => (
  <Card sectioned>
    <Card.Section flush>
      <Heading>
        <Link url={url} external>
          {headline}
        </Link>
      </Heading>
      <TextContainer>
        <p>{summary}</p>
      </TextContainer>
    </Card.Section>
  </Card>
);
