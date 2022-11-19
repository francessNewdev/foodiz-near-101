import { Meal, mealStorage, OrderInfo, userOrders, orderStorage, setPaymentAddress, getPaymentAddress } from './model';
import { context, ContractPromiseBatch, u128 } from "near-sdk-as";

/**
 * @dev function is private function i.e. can only be called by contract
 * 
 * @param paymentAddress - address where payment for orders are made
 */
export function updatePaymentAddress(paymentAddress: string): void {
    assert(context.predecessor == context.contractName, "Method is private");
    setPaymentAddress(paymentAddress)
}


/**
 * 
 * @param meal - a meal to be added to the blockchain
 */
export function addNewMeal(meal: Meal): void {
    let storedMeal = mealStorage.get(meal.id);
    if (storedMeal !== null) {
        throw new Error(`a meal with id=${meal.id} already exists`);
    }
    mealStorage.set(meal.id, Meal.fromPayload(meal));
}

/**
 * 
 * A function that returns a single meal for given meal id
 * 
 * @param id - an identifier of a meal to be returned
 * @returns a meal for a given @param id
 */
export function getMeal(id: string): Meal | null {
    return mealStorage.get(id);
}

/**
 * 
 * A function that returns an array of meals in contract
 * 
 * @returns an array of objects that represent a meal
 */
export function getMeals(): Array<Meal> {
    return mealStorage.values();
}

/**
 * 
 * This is used to issue buy transactions when orders are made.
 * 
 * @param orderInfo - an information containing the the user orders
 */
export function placeOrder(orderInfo: OrderInfo): void {
    let storedOrder = orderStorage.get(orderInfo.id);
    if (storedOrder !== null) {
        throw new Error(`An order with id=${orderInfo.id} already exists`);
    }
    let total = OrderInfo.getTotal(orderInfo);

    if (!u128.eq(context.attachedDeposit, total)) {
        throw new Error("Amount not equal to total price")
    }

    let paymentAddress = getPaymentAddress();

    ContractPromiseBatch.create(paymentAddress).transfer(total);

    orderStorage.set(orderInfo.id, OrderInfo.fromPayload(orderInfo, total));

    let userOrderArray = getUserOrders(context.predecessor);

    userOrderArray.push(orderInfo.id);

    userOrders.set(context.predecessor, userOrderArray);

}

/**
 * 
 * A function that returns an array of orders made by user.
 * 
 * @param accountId - user account id
 * @returns an array for a given @param accountId
 */
export function getUserOrders(accountId: string): Array<String> {
    let userOrder = userOrders.get(accountId);

    if (userOrder == null) {
        return new Array<String>();
    } else {
        return userOrder;
    }
}

/**
 * 
 * A function that returns the order information for given order id
 * 
 * @param id - an identifier of the order  to be returned
 * @returns the order information for a given @param id
 */
export function getOrderInfo(id: string): OrderInfo | null {
    return orderStorage.get(id);
}

/**
 * 
 * A function that deletes the order information for given order id
 * 
 * @param id - an identifier of the order to be deleted
 */
export function deleteOrder(id: string): void {
    let order = orderStorage.get(id);
    if (order == null) {
        throw new Error(`Order ${id} does not exist`);
    }
    orderStorage.delete(id);
}