import React, { useState, useCallback, useEffect } from "react";
import Cover from "./components/Cover";
import "./App.css";
import "./css/style.css";
import Foodiz from "./components/foodiz";
import { Container } from "react-bootstrap";
import { login, logout as destroy, accountBalance } from "./utils/near";
import { Notification } from "./components/utils/Notifications";
import coverImg from "./assets/img/foodiz.jpg";

const App = function AppWrapper() {
  const account = window.walletConnection.account();

  const [balance, setBalance] = useState("0");

  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  }, [account]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <>
      <Notification />
      {account.accountId ? (
        <Container fluid className="main-nav">
          <Foodiz
            address={account.accountId}
            balance={balance}
            disconnect={destroy}
          />
        </Container>
      ) : (
        <Cover name={"Foodiz Hub"} coverImg={coverImg} connect={login} />
      )}
    </>
  );
};

export default App;
