const CONFIG = {
  RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
  TOKENS_PER_BNB: 120000000000
};

let web3;
let userAddress = "";
let web3Modal;

window.addEventListener("DOMContentLoaded", () => {
  initWeb3Modal();
  document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
  document.getElementById("buyBtn").addEventListener("click", sendBNB);
  document.getElementById("bnbAmount").addEventListener("input", calculateFDAI);
});

function initWeb3Modal() {
  const providerOptions = {
    walletconnect: {
      package: window.WalletConnectProvider.default,
      options: {
        rpc: {
          56: "https://bsc-dataseed.binance.org/"
        }
      }
    }
  };

  web3Modal = new window.Web3Modal.default({
    cacheProvider: false,
    providerOptions
  });
}

async function connectWallet() {
  try {
    const provider = await web3Modal.connect();
    web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    userAddress = accounts[0];

    await web3.eth.personal.sign("FreeDogeAI Satışı için imza onayı", userAddress, "");

    updateWalletUI();
  } catch (err) {
    console.error("Bağlantı hatası:", err);
    alert("Cüzdan bağlanamadı. Lütfen tekrar deneyin.");
  }
}

function updateWalletUI() {
  const short = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
  document.getElementById("walletAddress").textContent = short;
  document.getElementById("walletInfo").style.display = "block";
  document.getElementById("connectWalletBtn").textContent = "✅ Connected";
  document.getElementById("buyBtn").disabled = false;

  web3.eth.getBalance(userAddress).then(balance => {
    const bnb = web3.utils.fromWei(balance, "ether");
    document.getElementById("bnbBalance").textContent = `${parseFloat(bnb).toFixed(6)} BNB`;
  });
}

function calculateFDAI() {
  const amount = parseFloat(document.getElementById("bnbAmount").value) || 0;
  document.getElementById("fdaiAmount").textContent = (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
}

async function sendBNB() {
  const bnbAmount = parseFloat(document.getElementById("bnbAmount").value);
  if (!bnbAmount || bnbAmount <= 0) {
    alert("Lütfen geçerli bir miktar girin!");
    return;
  }

  try {
    const wei = web3.utils.toWei(bnbAmount.toString(), "ether");
    const tx = await web3.eth.sendTransaction({
      from: userAddress,
      to: CONFIG.RECEIVE_WALLET,
      value: wei,
      gas: 300000
    });

    alert(`✅ ${bnbAmount} BNB gönderildi!\nTX Hash: ${tx.transactionHash}`);
  } catch (err) {
    console.error("İşlem başarısız:", err);
    alert("İşlem başarısız: " + (err.message || err));
  }
}
