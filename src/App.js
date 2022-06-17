import { useState } from "react";
import Moralis from "moralis";
import { useMoralis, useWeb3Transfer } from "react-moralis";
import { useNotification, Loading } from "web3uikit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import "@rainbow-me/rainbowkit/styles.css";
import "@rainbow-me/rainbowkit/dist/index.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    chain.polygonMumbai,
    chain.rinkeby,
    chain.kovan,
    chain.goerli,
  ],
  [
    alchemyProvider({ alchemyId: "Ub6w7PGfjdvhPmGpBFvFWijeF5G9eY4b" }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  const { isAuthenticated } = useMoralis();
  const [amount, setAmount] = useState("");
  const { fetch, isFetching, isLoading } = useWeb3Transfer({
    type: "native",
    amount: Moralis.Units.ETH(Number(amount)),
    receiver: "0xC34ad4A95adCD9021182fd5607ED822DB738E7c4",
  });


  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const dispatch = useNotification();

  const handleInvalidAmount = () => {
    dispatch({
      type: "error",
      message: "Please, enter a valid amount to donate",
      title: "Invalid Amount",

      position: "topL",
    });
  };

  const transactionSuccessfulNotification = () => {
    dispatch({
      type: "success",
      message: "Thank you for donating to web3bridge...",
      title: "Donation Succesful!",

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

  const handleDonate = async () => {
    setTransactionSuccess(true);
    let transactionReceipt = await fetch();
    console.log("Transaction", transactionReceipt);
    let transactionResult = await transactionReceipt.wait();
    console.log("transaction result", transactionResult);
    transactionReceipt && setTransactionSuccess(false);
    transactionReceipt && transactionSuccessfulNotification();
    console.log("connected!");
    // if (!isAuthenticated) {
    //   handleNotLogin();
    //   console.log("not loggin");
    // } else if (isAuthenticated && Number(amount) === 0) {
    //   handleInvalidAmount();
    //   console.log("login it but invalid amounts");
    // } else {
    //   setTransactionSuccess(true);
    //   let transactionReceipt = await fetch();
    //   console.log("Transaction", transactionReceipt);
    //   let transactionResult = await transactionReceipt.wait();
    //   console.log("transaction result", transactionResult);
    //   transactionReceipt && setTransactionSuccess(false);
    //   transactionReceipt && transactionSuccessfulNotification();
    //   console.log("connected!");
    // }

    setAmount("");
  };

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
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
          </div>

          <footer>© Handcrafted from scratch with 💖 by devlongs.</footer>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
