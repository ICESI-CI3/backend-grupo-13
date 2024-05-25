import { User } from "src/auth/entities/user.entity";
import { RoleEnum } from "src/auth/enum/role.enum"
import { ShoppingCart } from "src/shopping_cart/entities/shopping_cart.entity";
import {v4 as uuid} from "uuid";
import { usersMap } from "./users.data";

const preShoppingCarts = [
    {
        user: usersMap["user1"],
    },
    {
        user: usersMap["user2"],
    }
];

const shoppingCarts: ShoppingCart[] = preShoppingCarts.map((cart) => {return {}})
const shoppingCartsMap = Object.fromEntries(shoppingCarts.map((cart) => [cart.id, cart]));

export {shoppingCartsMap};
export default shoppingCarts;