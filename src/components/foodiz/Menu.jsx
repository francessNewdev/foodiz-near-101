import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import Meal from "./Meal";
import { Order } from "../../utils/foodiz";

const Menu = ({ meals, createOrder }) => {
  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);

  const addToCart = (mealId, price) => {
    const order = new Order(mealId, 1);
    let newOrder = orders;
    newOrder.push(order);
    setOrders(newOrder);
    setTotal(total + Number(price));
  };
  const addCount = (mealId, price) => {
    const update = orders.map((meal) =>
      meal.mealId === mealId ? { ...meal, count: meal.count + 1 } : meal
    );
    setOrders(update);
    setTotal(total + Number(price));
  };
  const subCount = (mealId, price) => {
    const update = orders.map((meal) =>
      meal.mealId === mealId ? { ...meal, count: meal.count - 1 } : meal
    );
    let update2 = update.filter((meal) => meal.count !== 0);
    setOrders(update2);
    setTotal(total - Number(price));
  };

  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="collbtn" id="explore" style={{ marginTop: "40px" }}>
        <Button
          onClick={handleShow}
          className="btn btn-primary"
          style={{ textAlign: "center", display: "block", margin: "10px auto" }}
        >
          Explore Our Menu
        </Button>
      </div>
      {show ? (
        <div id="menuBar">
          <div className="cardmenu">
            <div className="pay">
              <div className="paisa">
                Total is &nbsp;
                <span id="amtbtn">{total ? total : "0"}</span> &nbsp;NEAR
              </div>
              <Button
                id="payBtn"
                disabled={total === 0}
                onClick={() => createOrder({ id: 0, orders }, total)}
                variant="dark"
                className="topay rounded-pill"
              >
                Pay Now
              </Button>
            </div>
            <div className="menu" id="menu">
              {meals.map((meal, index) => (
                <Meal
                  key={index}
                  meal={meal}
                  addToCart={addToCart}
                  addCount={addCount}
                  subCount={subCount}
                  orders={orders}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
};

Menu.propTypes = {
  address: PropTypes.string.isRequired,
  meals: PropTypes.instanceOf(Object),
  createOrder: PropTypes.func.isRequired,
};

export default Menu;
