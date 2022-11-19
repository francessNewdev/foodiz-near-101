import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "./Header";
import Menu from "./Menu";
import Orders from "./Orders";
import Footer from "./Footer";
import Loader from "../utils/Loader";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import PropTypes from "prop-types";
import {
  addNewMeal,
  getMeals,
  placeOrder,
  getUserOrders,
  getOrderInfo,
  deleteOrders,
} from "../../utils/foodiz";

const Foodiz = ({ address, balance, disconnect }) => {
  const [meals, setMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllMeals = useCallback(async () => {
    try {
      setLoading(true);
      setMeals(await getMeals());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrders = useCallback(async () => {
    try {
      setLoading(true);
      const userOrdersArray = await getUserOrders(address);
      let userOrders = [];
      for (let i = 0; i < userOrdersArray.length; i++) {
        let id = userOrdersArray[i];
        let order = await getOrderInfo(id);
        if (order) {
          userOrders.push(order);
        }
      }
      setOrders(userOrders);
    } catch (error) {}
  }, [address]);

  const addMeal = (data) => {
    setLoading(true);
    addNewMeal(data)
      .then(() => {
        toast(<NotificationSuccess text="Meal added successfully." />);
        getAllMeals();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to create meal." />);
        setLoading(false);
      });
  };

  const createOrder = async (data, total) => {
    setLoading(true);
    if (!total) return;
    placeOrder(data, total)
      .then(async () => {
        toast(<NotificationSuccess text="Order added successfully." />);
        await getAllMeals();
        getOrders();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to create order." />);
        setLoading(false);
      });
  };

  const deleteOrder = async (order) => {
    setLoading(true);
    deleteOrders(order.id)
      .then(async () => {
        toast(<NotificationSuccess text="Order deleted successfully" />);
        await getAllMeals();
        getOrders();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to delete order." />);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllMeals();
    getOrders();
  }, [getAllMeals, getOrders]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Header
        address={address}
        balance={balance}
        disconnect={disconnect}
        addMeal={addMeal}
      />
      <main>
        <Menu address={address} meals={meals} createOrder={createOrder} />
        <Orders orders={orders} deleteOrder={deleteOrder} />
      </main>
      <Footer />
    </>
  );
};

Foodiz.propTypes = {
  address: PropTypes.string,
  balance: PropTypes.string,
  disconnect: PropTypes.func.isRequired,
};

export default Foodiz;
