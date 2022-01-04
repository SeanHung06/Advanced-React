/* eslint-disable */
import { CartItemCreateInput } from './../.keystone/schema-types';
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { Session } from '../types';
import { CartItem } from '../schemas/CartItem';

async function addToCart(
    root: any,
    {productId} : {productId: string},
    context: KeystoneContext
) : Promise<CartItemCreateInput> {
    console.log( ' ADD TO Cart!!!');

    // 1. Query the Current user to see if they are already signed in
    const sesh = context.session as Session;
    if(!sesh.itemId){
        throw new Error('You must be logged in to do this !')
    }

    // 2. Query the current user cart 
    const allCartItems = await context.lists.CartItem.findMany({
        where: { user : { id: sesh.itemId } , product: { id: productId}},
        resolveFields: 'id,quantity'    
    });

    const [existingCartItem] = allCartItems;
    console.log(existingCartItem)
    if(existingCartItem){
        console.log(
            `There are already ${existingCartItem.quantity}, increment by 1!`
        );
    
    // 3. See if the current cart item is already in the cart
    // 4. If it is then increment the quantity by 1
    return await context.lists.CartItem.updateOne({
        id:existingCartItem.id,
        data: { quantity: existingCartItem.quantity+1},
        resolveFields: false,
    });
}
    // 4. If it isn't then create a new cart item
    return await context.lists.CartItem.createOne({
        data: { 
            product: {connect:{id:productId}},
            user: { connect: { id:sesh.itemId }},
        },
        resolveFields: false,
    })


}

export default addToCart;
