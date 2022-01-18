import { ListAccessArgs } from "./types";


export default function isSignedIn({ session}: ListAccessArgs){
    return !!session;// If there is no session then it will return false with double !


}