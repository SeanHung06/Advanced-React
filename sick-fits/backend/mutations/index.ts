import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';
import checkout from './checkout';

const graphql = String.raw
export const extendGraphqlSchema = graphQLSchemaExtension({
    //typeDefs
    typeDefs: graphql`
    type Mutation{
        addToCart(productId:ID): CartItem
        checkout(token: String!): Order
    }`,

    //Resolvers
    resolvers:{
        Mutation:{
            addToCart,
            checkout,
        }
    }
})