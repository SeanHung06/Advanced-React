import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";


export default function isSignedIn({ session}: ListAccessArgs){
    return !!session;// If there is no session then it will return false with double !


}
// To avoid Typing every permission check 
const generatedPermissions = Object.fromEntries(permissionsList.map(permissions =>[
    permission,
    function({session}:ListAccessArgs){
        return session?.data.role.[permission];
    }
]))
// Permissions check if someone meets a criteria - yes or no 
export const permissions = {
    ...generatedPermissions,
    // Shown of adding additional permission 
    isAwesome({session}: ListAccessArgs): boolean{
        return session?.data.name.includes('wes');
    },
}