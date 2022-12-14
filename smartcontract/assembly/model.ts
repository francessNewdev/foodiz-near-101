import { context, storage, PersistentUnorderedMap, u128 } from "near-sdk-as";

@nearBindgen
export class Meal {
    id: string;
    name: string;
    image: string;
    price: u128;
    sold: u32;
    public static fromPayload(payload: Meal): Meal {
        const meal = new Meal();
        meal.id = payload.id;
        meal.name = payload.name;
        meal.image = payload.image;
        meal.price = payload.price;
        return meal;
    }
    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
    }
}

@nearBindgen
export class Order {
    mealId: string;
    count: u32;
}

@nearBindgen
export class OrderInfo {
    id: string;
    orders: Array<Order>;
    total: u128;
    date: u64;

    public static fromPayload(payload: OrderInfo, total: u128): OrderInfo {
        const newOrder = new OrderInfo();
        newOrder.id = payload.id;
        newOrder.orders = payload.orders;
        newOrder.total = total;
        newOrder.date = context.blockTimestamp;
        return newOrder;
    }

    public static getTotal(payload: OrderInfo): u128 {
        let orders = payload.orders;
        let total = u128.from(0);
        for (let i = 0; i < orders.length; i++) {
            let order = orders[i];

            let mealInfo = mealStorage.get(order.mealId);

            if (mealInfo == null) {
                throw new Error(`${order.mealId} is not a valid meal order`)
            }
            let estimate = u128.mul(mealInfo.price, u128.from(order.count));
            total = u128.add(total, estimate);
        }
        return total
    }
}

export function setPaymentAddress(address: string): void {
    storage.set<string>("pAddr", address)
}

export function getPaymentAddress(): string {
    return storage.getPrimitive<string>("pAddr", "shop.foodiz.testnet")
}

export const mealStorage = new PersistentUnorderedMap<string, Meal>("Listed_Meals");
export const orderStorage = new PersistentUnorderedMap<string, OrderInfo>("All_Orders");
export const userOrders = new PersistentUnorderedMap<string, Array<String>>("User_Orders");