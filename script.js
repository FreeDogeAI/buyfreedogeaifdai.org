// Config
const CONFIG = {
  RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
  TOKENS_PER_BNB: 120000000000,
  BSC_CHAIN_ID: 56
};

// State
let web3;
let userAddress = "";

// Initialize
window.addEventListener('DOMContentLoaded', init);

function init() {
  setupEventListeners();
  checkExistingConnection();
}

// 1. CÜZDAN BAĞLANTISI (MOBİL UYUMLU)
async function connectWallet() {
  try {
    if (!window.ethereum) {
      // Direkt MetaMask uygulamasını aç
      window.location.href = "metamask://";
      
      // 1 saniye bekle (uygulamanın açılması için)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Tekrar kontrol et
      if (!window.ethereum) {
        throw new Error("MetaMask uygulamasında sayfayı açın");
      }
    }

    // MetaMask bağlantı isteği
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    userAddress = accounts[0];
    web3 = new Web3(window.ethereum);

    // Mobilde imza isteği (ZORUNLU)
    const message = `FreeDogeAI Presale Onayı\n\nAdres: ${userAddress}`;
    await window.ethereum.request({
      method: 'personal_sign',
      params: [message, userAddress]
    });

    // BSC ağına geçiş
    await switchToBSC();
    
    // UI güncelleme
    updateWalletUI();

  } catch (error) {
    console.error("Bağlantı hatası:", error);
    alert(`Bağlantı başarısız: ${error.message}`);
  }
}

// 2. BNB HESAPLAMA
function calculateFDAI() {
  const amount = parseFloat(document.getElementById('bnbAmount').value) || 0;
  document.getElementById('fdaiAmount').textContent = 
    (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
}

// 3. TOKEN SATIN ALMA
async function sendBNB() {
  const bnbAmount = parseFloat(document.getElementById('bnbAmount').value);
  
  if (!bnbAmount || bnbAmount <= 0) {
    alert("Lütfen geçerli BNB miktarı girin");
    return;
  }

  try {
    const weiAmount = web3.utils.toWei(bnbAmount.toString(), 'ether');
    const tx = {
      from: userAddress,
      to: CONFIG.RECEIVE_WALLET,
      value: weiAmount,
      gas: 300000,
      gasPrice: await web3.eth.getGasPrice()
    };

    const receipt = await web3.eth.sendTransaction(tx);
    
    alert(`✅ Başarılı! ${bnbAmount} BNB gönderildi. ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI alacaksınız.`);

    // Bakiye güncelleme
    updateWalletBalance();

  } catch (error) {
    console.error("İşlem hatası:", error);
    alert(`İşlem başarısız: ${error.message}`);
  }
}

// YARDIMCI FONKSİYONLAR
async function switchToBSC() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x38' }]
    });
  } catch (error) {
    console.error("Ağ değiştirme hatası:", error);
  }
}

function updateWalletUI() {
  const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
  document.getElementById('walletAddress').textContent = shortAddress;
  document.getElementById('walletInfo').style.display = 'block';
  document.getElementById('connectWalletBtn').textContent = '✅ Bağlandı';
  document.getElementById('buyBtn').disabled = false;
  updateWalletBalance();
}

async function updateWalletBalance() {
  if (!userAddress) return;
  const balance = await web3.eth.getBalance(userAddress);
  document.getElementById('bnbBalance').textContent = 
    `${parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(6)} BNB`;
}

// EVENT LISTENERS
function setupEventListeners() {
  document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
  document.getElementById('buyBtn').addEventListener('click', sendBNB);
  document.getElementById('bnbAmount').addEventListener('input', calculateFDAI);
}

function checkExistingConnection() {
  if (window.ethereum && window.ethereum.selectedAddress) {
    userAddress = window.ethereum.selectedAddress;
    web3 = new Web3(window.ethereum);
    updateWalletUI();
  }
}

// MOBİL UYUMLULUK
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length > 0) {
      userAddress = accounts[0];
      updateWalletUI();
    } else {
      disconnectWallet();
    }
  });

  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
}

function disconnectWallet() {
  document.getElementById('walletInfo').style.display = 'none';
  document.getElementById('connectWalletBtn').textContent = '🔗 MetaMask ile Bağlan';
  document.getElementById('buyBtn').disabled = true;
  userAddress = "";
  web3 = null;
}
