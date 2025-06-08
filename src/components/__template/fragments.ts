import { graphql } from 'gql.tada';


export const ComponentFragment = graphql(`
  fragment ComponentFragment on ComponentSectionRecord @_unmask {
    _modelApiKey
  }
`);