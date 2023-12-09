import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";

interface NotificationItemData {
  cta: string;
  title: string;
  message: string;
  app: string;
  icon: string;
  image: string;
  url: string;
  blockchain: string;
  notification: string;
}

interface NotifItem extends NotificationItemData {
  key: number;
}

function Notification(props: any) {
  const [wallet, setWallet] = useState<string>(
    "0xD8634C39BBFd4033c0d3289C4515275102423681"
  );
  const [notifItems, setNotifItems] = useState<NotifItem[]>([]);

  const walletRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (walletRef.current) {
      walletRef.current.value = wallet;
    }
  }, [wallet]);

  const fetchNotification = async () => {
    const walletText = walletRef.current?.value;

    if (!walletText) return;

    // Demo only supports MetaMask (or other browser based wallets) and gets provider that injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Switch to sepolia
    await provider.send("wallet_switchEthereumChain", [{ chainId: "0xAA36A7" }]);

    // Get provider
    await provider.send("eth_requestAccounts", []);

    // Grabbing signer from provider
    const signer = provider.getSigner();

    // Initialize user for push
    const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });

    // retrieve notifications for users
    const inboxNotifications = await userAlice.notification.list("INBOX", {
      account: `eip155:11155111:${walletText}`,
      limit: 5,
    });

    // set notifItems state so that react can render
    setNotifItems(inboxNotifications.map((notif, idx) => ({ ...notif, key: idx })));
  };

  function NotificationInterface() {
    const inputStyle = {
      padding: "10px",
      margin: "10px 0",
      width: "100%",
      boxSizing: "border-box",
    };

    const textareaStyle = {
      ...inputStyle,
      height: "100px",
      resize: "vertical",
    };

    const buttonStyle = {
      padding: "10px 20px",
      backgroundColor: "#dd44b9",
      color: "#FFF",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "20px",
    };

    return (
      <div style={{ width: "auto", margin: "20px auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <h2>
              Pull based mechanism for displaying notifcations on frontend
            </h2>
            <p />
            <label>
              Put any wallet address and click on fetch notifications to see the
              live results. Click to expand <b>Live Editor</b> tab to see the
              code and play with it. For this demo, You will need Metamask (or
              equivalent browser injected wallet), you will also need to sign a
              transaction to see the notifications.
            </label>
            <p />
            <label>Wallet address</label>
            <input
              type="text"
              placeholder="Enter wallet address"
              style={inputStyle}
              ref={walletRef}
              maxLength={80}
            />
          </div>
        </div>
        <button style={buttonStyle} onClick={fetchNotification}>
          Fetch Notifications
        </button>

        <p />
        <p />

        {notifItems.length > 0 ? (
          <h3>{`Notification Items for ${wallet}`}</h3>
        ) : (
          <></>
        )}

        {notifItems.map((notifItem, idx) => (
          <NotificationItem
            key={idx} // any unique id
            notificationTitle={notifItem.title}
            notificationBody={notifItem.message}
            cta={notifItem.cta}
            app={notifItem.app}
            icon={notifItem.icon}
            image={notifItem.image}
            url={notifItem.url}
            theme={"light"} // or can be dark
            chainName={notifItem.blockchain as chainNameType} // if using Typescript
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <NotificationInterface />
    </>
  );
}

export default Notification;
