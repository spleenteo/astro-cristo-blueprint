import { graphql } from '~/lib/datocms/graphql';

// Query for the specific page
export const query = graphql(/* GraphQL */ `
  query SinglePage($slug: String!, $locale: SiteLocale = en) {
    page(filter: { slug: { eq: $slug } }, locale: $locale) {
      title
      id
      slug
    }
  }
`);
