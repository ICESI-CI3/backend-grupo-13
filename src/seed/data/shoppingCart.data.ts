import { ShoppingCart } from "src/shopping_cart/entities/shopping_cart.entity";
import {v4 as uuid} from "uuid";
import { usersMap } from "./users.data";
import ebooks from "./ebooks.data";

const preShoppingCarts = [
    {
        user: usersMap["user1"],
        ebooks: [ebooks[1], ebooks[2], ebooks[3]]
    },
    {
        user: usersMap["user2"],
        ebooks: [ebooks[11]]
    }
    ,
    {
        user: usersMap["gMartin"],
        ebooks: []
    },
    {
        user: usersMap["jRowling"],
        ebooks: []
    },
    {
        user: usersMap["jGrisham"],
        ebooks: []
    },
    {
        user: usersMap["jTolkien"],
        ebooks: []
    },
    {
        user: usersMap["mCervantes"],
        ebooks: []
    },
    {
        user: usersMap["fHerbert"],
        ebooks: []
    },
    {
        user: usersMap["sKing"],
        ebooks: []
    }
    ,
    {
        user: usersMap["sKing"],
        ebooks: []
    }
];

const shoppingCarts: ShoppingCart[] = preShoppingCarts.map((cart) => {return {id: uuid(), ...cart}})
const shoppingCartsMap = Object.fromEntries(shoppingCarts.map((cart) => [cart.id, cart]));

export {shoppingCartsMap};
export default shoppingCarts;