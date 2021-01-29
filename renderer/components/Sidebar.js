import { Navigation } from '@shopify/polaris';
import { useRouter } from 'next/router';
import { HomeMajor, GlobeMajor } from '@shopify/polaris-icons';

export const Sidebar = () => {
  const router = useRouter();

  return (
    <Navigation location={router.pathname}>
      <Navigation.Section
        items={[
          {
            label: 'Dashboard',
            url: '/home',
            exactMatch: true,
            icon: HomeMajor,
          },
          {
            label: 'News',
            url: '/news',
            icon: GlobeMajor,
          },
        ]}
      />
    </Navigation>
  );
};
