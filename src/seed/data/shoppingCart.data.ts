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
];

const shoppingCarts: ShoppingCart[] = preShoppingCarts.map((cart) => {return {id: uuid(), ...cart}})
const shoppingCartsMap = Object.fromEntries(shoppingCarts.map((cart) => [cart.id, cart]));

export {shoppingCartsMap};
export default shoppingCarts;