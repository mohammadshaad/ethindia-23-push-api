
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

export function Notification2(props: any) {
  const [wallet, setWallet] = useState<string>(
    "0xD8634C39BBFd4033c0d3289C4515275102423681"
  );
  const [progressTexts, setProgressTexts] = useState<string[]>([]);
  const [notifItems, setNotifItems] = useState<NotifItem[]>([]);

  const walletRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (walletRef.current) {
      walletRef.current.value = wallet;
    }
  }, [wallet]);

  const triggerNotification = async () => {
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

    // establish connection to stream
    const stream = await userAlice.initStream([CONSTANTS.STREAM.CONNECT, CONSTANTS.STREAM.NOTIF]);

    // Listen for stream connection
    stream.on(CONSTANTS.STREAM.CONNECT, async (data) => {
      console.log("STREAM CONNECTED");
      let text = ['Stream Connected...', 'Sending Simulated Notification...', 'Wait for few moments for stream to capture notif and display...', 'Waiting for you to sign notification payload...'];
      setProgressTexts(text);
      await userAlice.channel.send([userAlice.account], {
        notification: { 
          title: 'GM Builders!', 
          body: `_Simulated notification_ listened by stream and rendered with **@UIWeb/NotificationItem** with the latest timestamp - ${new Date().valueOf()} [timestamp: ${new Date().valueOf()}]` 
        },
        payload: {
          title: 'GM Builders!', 
          body: `_Simulated notification_ listened by stream and rendered with **@UIWeb/NotificationItem** with the latest timestamp - ${new Date().valueOf()} [timestamp: ${new Date().valueOf()}]`,
          cta: 'https://push.org',
          embed: 'https://push.org/assets/images/cover-image-8485332aa8d3f031e142a1180c71b341.webp',
        }
      });
      text.push('Message generated and sent. Waiting for the stream to pick it up...');
      setProgressTexts(text);
    });

    // Listen for notifications
    stream.on(CONSTANTS.STREAM.NOTIF, (item) => {
      let text = progressTexts;
      console.log(item);
      text.push('Notification Received...');
      text.push(JSON.stringify(item));
      setProgressTexts(text);

      // create notification item compatible with UIWeb/NotificationItem
      const compatibleNotifItem = {
        title: item.message.payload.title,
        message: item.message.payload.body,
        image: item.message.payload.embed,
        cta: item.message.payload.cta,
        icon: item.channel.icon,
        app: item.channel.name,
        url: item.channel.url,
        blockchain: item.source,
        notification: item.message.notification,
      };
      setNotifItems([compatibleNotifItem]);
    });

    // connect stream
    stream.connect();
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
              Push based mechanism for displaying notifications on frontend
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
          </div>
        </div>
        <div>
          <hr />
          <h3>Progress (will show progress information once Trigger Notification is clicked)</h3>

          {progressTexts.map((text, idx) => {
            return (
              <React.Fragment key={idx}>
                <span>{text}</span>
                <br />
              </React.Fragment>
            );
          })}
        </div>
        <hr />
        <button style={buttonStyle} onClick={triggerNotification}>
          Trigger Notification
        </button>

        <p />
        <p />

        {notifItems.length > 0 ? (
          <h3>{`Notification Items for ${wallet}`}</h3>
        ) : (
          <></>
        )}

        {notifItems.map((notifItemSingular, idx) => {
          const {
            cta,
            title,
            message,
            app,
            icon,
            image,
            url,
            blockchain,
            notification,
          } = notifItemSingular;

          return (
            <NotificationItem
              key={idx} // any unique id
              notificationTitle={title}
              notificationBody={message}
              cta={cta}
              app={app}
              icon={icon}
              image={image}
              url={url}
              theme={"light"} // or can be dark
              chainName={blockchain as chainNameType} // if using Typescript
            />
          );
        })}
      </div>
    );
  }

  return (
    <>
      <NotificationInterface />
    </>
  );
}

export default Notification2;
