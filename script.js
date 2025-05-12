const CONFIG = {
  RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
  TOKENS_PER_BNB: 120000000000
};

let web3Modal;
let provider;
let web3;
let userAddress = "";

window.addEventListener("DOMContentLoaded", async () => {
  initWeb3Modal();

  document.getElementById("connectWalletBtn").addEventListener("click", async () => {
    try {
      provider = await web3Modal.connect();
      web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();
      userAddress = accounts[0];

      const message = "FreeDogeAI Signature";
      await provider.request({
        method: 'personal_sign',
        params: [web3.utils.utf8ToHex(message), userAddress]
      });

      updateUI();
    } catch (e) {
      console.error("Connection error:", e);
      alert("Cüzdan bağlantısı başarısız.");
    }
  });
});

function initWeb3Modal() {
  const providerOptions = {
    walletconnect: {
      package: window.WalletConnectProvider.default,
      options: {
        rpc: {
          56: "https://bsc-dataseed.binance.org/"
        },
        projectId: "3c1933cfa3a872a06dbaa2011dab35a2", // senin ID
        mobileLinks: ["metamask", "trust"]
      }
    }
  };

  web3Modal = new window.Web3Modal.default({
    cacheProvider: false,
    providerOptions
  });
}

async function updateUI() {
  const shortAddr = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
  document.getElementById("walletAddress").textContent = shortAddr;
  document.getElementById("walletInfo").style.display = "block";

  const balance = await web3.eth.getBalance(userAddress);
  const bnb = web3.utils.fromWei(balance, "ether");
  document.getElementById("bnbBalance").textContent = `${parseFloat(bnb).toFixed(4)} BNB`;
}
