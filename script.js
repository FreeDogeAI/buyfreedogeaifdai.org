const CONFIG = {
  RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
  TOKENS_PER_BNB: 120000000000
};

const projectId = "3c1933cfa3a872a06dbaa2011dab35a2"; // senin WalletConnect ID

const web3Modal = new window.Web3Modal.default({
  projectId,
  themeMode: "dark",
  walletConnectVersion: 2,
  standaloneChains: ["eip155:56"]
});

let provider;
let signer;
let userAddress = "";

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
  document.getElementById("buyBtn").addEventListener("click", sendBNB);
  document.getElementById("bnbAmount").addEventListener("input", calculateFDAI);
});

async function connectWallet() {
  try {
    provider = await web3Modal.connect();
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    signer = ethersProvider.getSigner();
    userAddress = await signer.getAddress();

    // Mobil imza (bağlantı onayı)
    const message = "FreeDogeAI Signature Confirmation";
    await signer.signMessage(message);

    updateWalletUI(ethersProvider);
  } catch (err) {
    console.error("Bağlantı hatası:", err);
  }
}

async function updateWalletUI(ethersProvider) {
  const short = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
  document.getElementById("walletAddress").textContent = short;
  document.getElementById("walletInfo").style.display = "block";
  document.getElementById("connectWalletBtn").textContent = "✅ Connected";
  document.getElementById("buyBtn").disabled = false;

  const balance = await ethersProvider.getBalance(userAddress);
  const bnb = ethers.utils.formatEther(balance);
  document.getElementById("bnbBalance").textContent = `${parseFloat(bnb).toFixed(6)} BNB`;
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
    const wei = ethers.utils.parseEther(bnbAmount.toString());
    const tx = await signer.sendTransaction({
      to: CONFIG.RECEIVE_WALLET,
      value: wei,
      gasLimit: 300000
    });

    alert(`✅ ${bnbAmount} BNB gönderildi!\nAlacak: ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI\nTX Hash: ${tx.hash}`);
  } catch (err) {
    console.error("İşlem başarısız:", err);
    alert("İşlem başarısız: " + (err.message || err));
  }
}
