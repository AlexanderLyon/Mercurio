import { SkeletonPage, SkeletonDisplayText, SkeletonBodyText, Layout, Card, TextContainer } from '@shopify/polaris';

export const SkeletonLoadingPage = () => (
  <SkeletonPage primaryAction fullWidth secondaryActions={2}>
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
        <Card>
          <Card.Section>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </TextContainer>
          </Card.Section>
          <Card.Section>
            <SkeletonBodyText lines={1} />
          </Card.Section>
        </Card>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
);
