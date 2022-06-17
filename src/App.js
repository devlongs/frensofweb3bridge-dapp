import { useState } from "react";
import Moralis from "moralis";
import { useMoralis, useWeb3Transfer } from "react-moralis";
import { ConnectButton, Loading } from "web3uikit";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const { isAuthenticated } = useMoralis();
  const [amount, setAmount] = useState("");
  const { fetch, isFetching, isLoading } = useWeb3Transfer({
    type: "native",
    amount: Moralis.Units.ETH(Number(amount)),
    receiver: "0xC34ad4A95adCD9021182fd5607ED822DB738E7c4",
  });

  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionFailure, setTransactionFailure] = useState(false);

  const onInvalidNotification = () =>
    toast.error("Please, enter a valid amount to donate", {
      duration: 5000,
    });

  const handleInvalidAmount = () => {
    onInvalidNotification();
  };

  const onSomethingWentWrong = () =>
    toast.error("Transaction failed!", {
      duration: 5000,
    });
  const somethingWentWrong = () => {
    onSomethingWentWrong();
  };

  const onSuccessNotification = () =>
    toast.success("Donation recieved successfully.", {
      duration: 9000,
    });

  const thankYouMessage = () =>
    toast.success("Thank you for donating to web3bridge", {
      duration: 9000,
      icon: "👏",
    });

  const transactionSuccessfulNotification = () => {
    onSuccessNotification();
    setTimeout(() => thankYouMessage(), 9000);
  };

  const onNotLogin = () =>
    toast.error("Please, connect with metamask to continue", {
      duration: 5000,
    });

  const handleNotLogin = () => {
    onNotLogin();
  };

  const handleDonate = async () => {
    if (!isAuthenticated) {
      handleNotLogin();
    } else if (isAuthenticated && Number(amount) === 0) {
      handleInvalidAmount();
    } else {
      try {
        setTransactionSuccess(true);
        let transactionReceipt = await fetch();
        console.log("Transaction", transactionReceipt);
        let transactionResult = await transactionReceipt.wait();
        console.log("transaction result", transactionResult);
        transactionReceipt && setTransactionSuccess(false);
        transactionReceipt && transactionSuccessfulNotification();
      } catch (err) {
        console.log("something went wrong", err);
        setTransactionFailure(true);
        !transactionFailure && somethingWentWrong();
        setTransactionSuccess(false);
      }
    }

    setAmount("");
  };

  return (
    <>
      <header>
        <img src="/fren.png" alt="logo" />
        <div className="right-section">
          <ul>
            <li>
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

        <button
          onClick={handleDonate}
          disabled={isFetching}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {transactionSuccess ? (
            <Loading size={20} spinnerColor="#fff" />
          ) : (
            "Donate"
          )}
        </button>
        <Toaster />
      </div>

      <footer>© Handcrafted from scratch with 💖 by devlongs.</footer>
    </>
  );
}

export default App;
