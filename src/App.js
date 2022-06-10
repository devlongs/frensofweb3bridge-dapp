import { useState } from "react";
import Moralis from "moralis";
import { useMoralis, useWeb3Transfer } from "react-moralis";
import { ConnectButton, useNotification } from "web3uikit";

function App() {
  const { isAuthenticated } = useMoralis();
  const [amount, setAmount] = useState("");
  const { fetch, isFetching } = useWeb3Transfer({
    type: "native",
    amount: Moralis.Units.ETH(Number(amount)),
    receiver: "0xC34ad4A95adCD9021182fd5607ED822DB738E7c4",
  });

  const dispatch = useNotification();

  const handleInvalidAmount = () => {
    dispatch({
      type: "error",
      message: "Please, enter a valid amount to donate",
      title: "Invalid Amount",

      position: "topL",
    });
  };

  const handleNotLogin = () => {
    dispatch({
      type: "error",
      message: "Please, connect with metamask to continue",
      title: "Login",

      position: "topL",
    });
  };

  const handleDonate = () => {
    if (!isAuthenticated) {
      handleNotLogin();
    } else if (isAuthenticated && Number(amount) === 0) {
      handleInvalidAmount();
    } else {
      fetch();
    }

    setAmount("");
  };

  console.log("Console is working!");

  return (
    <>
      <header>
        <img src="/fren.png" alt="logo" />
        <div className="right-section">
          <ul>
            <li>
              {/* <button>Connect Wallet</button> */}
              <ConnectButton />
            </li>
          </ul>
        </div>
      </header>

      <div className="intro">
        <h1>Giving it back to where we have all started.</h1>
        <p>
          Web3bridge has been a blessing for all of us. <br />
          It's time we give back to where we have all have started.
        </p>
      </div>

      <div className="input">
        <input
          type="number"
          value={amount}
          placeholder="Enter amount to donate"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />

        <button onClick={handleDonate} disabled={isFetching}>
          Donate
        </button>
      </div>
      <footer>© Handcrafted from scratch with 💖 by devlongs.</footer>
    </>
  );
}

export default App;
