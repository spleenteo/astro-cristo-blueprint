import { graphql } from '~/lib/datocms/graphql';

export const getAllPageSlugsQuery = graphql(`
    query GetAllPageSlugs($locale: SiteLocale = en) {
      allPages(locale: $locale) {
        id
        slug
        title
      }
    }
`);