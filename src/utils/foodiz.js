import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function addNewMeal(meal) {
  meal.id = uuid4();
  meal.price = parseNearAmount(meal.price + "");
  return window.contract.addNewMeal({ meal });
}

export function getMeals() {
  return window.contract.getMeals();
}

export function getMealInfo(id) {
  return window.contract.getMeal({ id });
}

export async function placeOrder(orderInfo, total) {
  orderInfo.id = uuid4();
  total = parseNearAmount(total + "");
  await window.contract.placeOrder({ orderInfo }, GAS, total);
}

export function getUserOrders(accountId) {
  return window.contract.getUserOrders({ accountId });
}

export function getOrderInfo(id) {
  return window.contract.getOrderInfo({ id });
}

export function deleteOrders(id) {
  return window.contract.deleteOrder({ id });
}

export class Order {
  constructor(mealId, count) {
    this.mealId = mealId;
    this.count = count;
  }
}

// Convert timestamp
export const convertTime = (secs) => {
  if (secs === 0) {
    return "--";
  }

  let dateObj = new Date(secs / 1000000);

  let date = dateObj.toLocaleDateString("en-us", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  let time = dateObj.toLocaleString("en-us", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return date + ", " + time;
};

// Truncate is done in the middle to allow for checking of first and last chars.
export const truncateId = (id) => {
  if (!id) return;
  return id.slice(0, 5) + "..." + id.slice(id.length - 5, id.length);
};
