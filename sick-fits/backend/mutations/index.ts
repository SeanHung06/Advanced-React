import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';

const graphql = String.raw
export const extendGraphqlSchema = graphQLSchemaExtension({
    //typeDefs
    typeDefs: graphql`
    type Mutation{
        addToCart(productId:ID): CartItem
    }`,

    //Resolvers
    resolvers:{
        Mutation:{
            addToCart,
        }
    }
})