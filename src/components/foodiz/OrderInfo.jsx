import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Table, Modal, Spinner } from "react-bootstrap";
import { utils } from "near-api-js";
import { getMealInfo, truncateId } from "../../utils/foodiz";

const OrderInfo = ({ order, show, setShowOrder }) => {
  const [mealNames, setNames] = useState(
    new Array(order.orders.length).fill("")
  );

  const getMealNames = useCallback(async () => {
    let meals = [];
    for (let i = 0; i < order.orders.length; i++) {
      let meal = order.orders[i];

      const mealInfo = await getMealInfo(meal.mealId);

      if (mealInfo) {
        meals.push(mealInfo.name);
      }
    }
    setNames(meals);
  }, [order]);

  useEffect(() => {
    getMealNames();
  }, [getMealNames]);

  const handleClose = () => setShowOrder(false);
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order {truncateId(order.id)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Meal</th>
                <th scope="col">Count</th>
              </tr>
            </thead>
            <tbody id="userorders">
              {order.orders ? (
                order.orders.map((meal, index) => (
                  <tr key={index} className="align-middle">
                    <td id="id">{index}</td>
                    <td id="meal">
                      {mealNames[index] ? (
                        mealNames[index]
                      ) : (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </td>
                    <td id="count">{meal.count}</td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={"2"}> You paid a Total of:{"  "}</td>
                <td>{utils.format.formatNearAmount(order.total)} NEAR</td>
              </tr>
            </tfoot>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

OrderInfo.propTypes = {
  order: PropTypes.instanceOf(Object).isRequired,
  show: PropTypes.bool.isRequired,
  setShowOrder: PropTypes.any,
};

export default OrderInfo;
