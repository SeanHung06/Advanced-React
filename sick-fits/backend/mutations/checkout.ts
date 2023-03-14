/* eslint-disable */
import { CartItemCreateInput, OrderCreateInput } from './../.keystone/schema-types';
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;
interface Arguments{
    token: string
}

async function checkout(
    root: any,
    {token} : Arguments,
    context: KeystoneContext
) : Promise<OrderCreateInput> {

    // 1. Make sure they are signed in
    const userId = context.session.itemId;
    if(!userId) {
        throw new Error('Sorry, You must be signed in to create an Order')
    }

    // 1.5 Query the current user

    const user = await context.lists.User.findOne({ 
        where : { id: userId },
        resolveFields: graphql`
        id
        name
        email
        cart{
            id
            quantity
            product{
                name
                price
                description
                id
                photo{
                    id
                    image{
                        id
                        publicUrlTransformed
                    }

                }
            }

        }
        `
    });
    console.dir(user,{ depth:null})
    // 2. calc the total price for their orders

    const cartItems = user.cart.filter(cartItem => cartItem.product); // To filter the order items that has been deleted by user

    const amount = cartItems.reduce(function(tally:number, cartItem: CartItemCreateInput){
        return tally + cartItem.quantity * cartItem.product.price;

    } ,0);
    console.log(amount);

    // 3. create the charge with the stripe library

    const charge = await stripeConfig.paymentIntents.create({
        amount,
        currency: 'USD',
        confirm: true,
        payment_method: token,
    }).catch(err => {
        console.log(err);
        throw new Error(err.message);
    });

    console.log(charge)
    // 4. Convert the cartItems to OrderItems
    const orderItems = cartItems.map((cartItem) => {
        const orderItem = {
            name: cartItem.product.name,
            description: cartItem.product.description,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            photo: {connect: {id: cartItem.product.photo.id}},
        }
        return orderItem;

    })
    // 5. Create the order and return it

    const order = await context.lists.Order.createOne({
        data:{
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems},
            user: {connect: {id: userId }}
        },
        resolveFields: false,

    });

    // 6. Clean up any old cart item

    const cartItemIds = user.cart.map(cartItem => cartItem.id); // cartItem changes to user.cart is to ensure while there is deleted item and it will be deleted and not shown again
    await context.lists.CartItem.deleteMany({
        ids: cartItemIds
    });
    return order;




}

export default checkout;