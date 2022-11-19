import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { utils } from "near-api-js";

const Meal = ({ meal, addToCart, addCount, subCount, orders }) => {
  const { name, image, price, id } = meal;

  let order = orders.find((order) => {
    return order.mealId === id;
  });
  let count = order ? order.count : 0;
  return (
    <div key={id} className="maincard">
      <div className="maincard-img">
        <img src={image} alt="" />
      </div>
      <div className="maincardtext">{name}</div>
      <div className="maprice">
        {utils.format.formatNearAmount(price)} Near per piece
      </div>
      {count === 0 ? (
        <Button
          onClick={() => addToCart(id, utils.format.formatNearAmount(price))}
          className="mbutton addToCart"
          style={{ textAlign: "center !important" }}
          id="mbtn"
        >
          Add to Cart
        </Button>
      ) : (
        <div
          id="item"
          className="Reitem"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            width: "100%",
            fontSize: "35px",
          }}
        >
          <div
            id="p"
            onClick={() => addCount(id, utils.format.formatNearAmount(price))}
            className="p"
          >
            <span id="p" className="p add">
              +
            </span>
          </div>
          <div className="display" id="counter">
            {count}
          </div>
          <div
            id="m"
            onClick={() => subCount(id, utils.format.formatNearAmount(price))}
            className="m"
          >
            <span id="m" className="m sub">
              -
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

Meal.propTypes = {
  meal: PropTypes.instanceOf(Object).isRequired,
  addToCart: PropTypes.func,
  addCount: PropTypes.func,
  subCount: PropTypes.func,
};

export default Meal;
