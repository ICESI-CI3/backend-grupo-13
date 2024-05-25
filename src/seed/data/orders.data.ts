import { Order } from "src/order/entities/order.entity";
import { usersMap } from "./users.data";
import {v4 as uuid} from "uuid";
import ebooks from "./ebooks.data";

const preOrders = [
    {
        referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
        user: usersMap["user1"],
        ebooks: [ebooks[10]],
        purchaseDate: new Date(),
        amount: 2,
    }
]

const orders: Order[] = preOrders.map((order) => {return {id: uuid(), ...order}})
export default orders;