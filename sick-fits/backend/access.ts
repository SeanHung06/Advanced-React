import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';


export function isSignedIn({ session}: ListAccessArgs){
    return !!session;// If there is no session then it will return false with double !


};
// To avoid Typing every permission check 
const generatedPermissions = Object.fromEntries(
    permissionsList.map(permission =>[
    permission,
    function({session}:ListAccessArgs){
        return !!session?.data.role?.[permission];
    }
]));
// Permissions check if someone meets a criteria - yes or no 
export const permissions = {
    ...generatedPermissions,
    // Shown of adding additional permission 
    //isAwesome({session}: ListAccessArgs): boolean{
    //    return session?.data.name.includes('wes');
    //},
};

// Role Based Function 
// Rules can return a boolean -yes or no - on a filter which limits which products they can CRUD
export const rules = {
    canManageProducts({session}:ListAccessArgs){
        // To take care of the not signed in user query order
        if(!isSignedIn({session})){
            return false;
        }
        // 1. Do they have the permission of canManageProducts
        if(permissions.canManageProducts({ session })){
            return true;
        }
        // 2. If not, do they own this item?
        return { user: { id: session.itemId } };
    },
    canOrder({session}:ListAccessArgs){
        // To take care of the not signed in user query order
        if(!isSignedIn({session})){
            return false;
        }

        // 1. Do they have the permission of canManageProducts
        if(permissions.canManageCart({ session })){
            return true;
        }
        // 2. If not, do they own this item?
        return { user: { id: session.itemId } };
    },
    canManageOrderItems({session}:ListAccessArgs){
        // To take care of the not signed in user query order
        if(!isSignedIn({session})){
            return false;
        }
        // 1. Do they have the permission of canManageProducts
        if(permissions.canManageCart({ session })){
            return true;
        }
        // 2. First  Query the Order and the Query the related User and check their ID to make sure they are lined up with what they have
        return { order: {user: { id: session.itemId } } }; 
    },
    canReadProducts({ session }: ListAccessArgs) {
        // To take care of the not signed in user query order
        if(!isSignedIn({session})){
            return false;
        }
        if(permissions.canManageProducts({ session })){
            return true;
        }
        // they should only see available products
        return {status: 'AVAILABLE'}
    },
};