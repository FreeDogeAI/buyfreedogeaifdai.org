// MetaMask Bağlantı ve Token Satın Alma
const CONTRACT_ADDRESS = "0xC14fF11c810B098D0476fB537D7Ee228aEb0B847";
const RECEIVER_WALLET = "0xd924e01c7d319c5B23708Cd622bD1143CD4Fb360";
const TOKEN_ADDRESS = "0x8161698A74F2ea0035B9912ED60140893Ac0f39C";
const RATE = 120000000000; // 1 BNB = 120,000,000,000 FDAI

async function initDApp() {
  // MetaMask kontrolü
  if (typeof window.ethereum === 'undefined') {
    redirectToMobile();
    return;
  }

  try {
    // Zincir değişikliklerini dinle
    window.ethereum.on('chainChanged', reloadApp);
    window.ethereum.on('accountsChanged', reloadApp);

    // Arayüz elementleri
    const connectBtn = document.getElementById('connectBtn');
    const buyBtn = document.getElementById('buyBtn');
    const bnbInput = document.getElementById('bnbInput');
    const fDaiOutput = document.getElementById('fDaiOutput');
    
    // Bağlantı butonu
    connectBtn.onclick = connectWallet;
    
    // Otomatik hesaplama
    bnbInput.oninput = () => {
      const bnbValue = parseFloat(bnbInput.value) || 0;
      fDaiOutput.textContent = (bnbValue * RATE).toLocaleString();
    };

    // Satın alma butonu
    buyBtn.onclick = () => purchaseTokens(bnbInput.value);

    // Eğer zaten bağlıysa
    if (window.ethereum.selectedAddress) {
      updateUI(window.ethereum.selectedAddress);
    }

  } catch (error) {
    console.error("Initialization error:", error);
    alert("Uygulama başlatılamadı: " + error.message);
  }
}

async function connectWallet() {
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    updateUI(accounts[0]);
  } catch (error) {
    console.error("Connection error:", error);
    alert("Cüzdan bağlantısı reddedildi: " + error.message);
  }
}

function updateUI(address) {
  document.getElementById('connectBtn').style.display = 'none';
  document.getElementById('walletInfo').style.display = 'block';
  document.getElementById('walletAddress').textContent = 
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  
  // İlk hesaplamayı yap
  document.getElementById('fDaiOutput').textContent = 
    (parseFloat(document.getElementById('bnbInput').value || 0) * RATE).toLocaleString();
}

async function purchaseTokens(bnbAmount) {
  if (!bnbAmount || parseFloat(bnbAmount) <= 0) {
    alert("Lütfen geçerli bir BNB miktarı girin");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Kontrat ABI (sadece gerekli fonksiyonlar)
    const ABI = [
      "function buyTokens() external payable",
      "function getBuyerInfo(address) public view returns (uint256,uint256,string,bool,uint256,string)"
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    
    // İşlemi gönder
    const tx = await contract.buyTokens({
      value: ethers.utils.parseEther(bnbAmount),
      gasLimit: 500000
    });
    
    // Başarı mesajı
    showTransactionModal(tx.hash);
    
    // İşlem sonucunu bekle
    const receipt = await tx.wait();
    console.log("Transaction receipt:", receipt);

  } catch (error) {
    handlePurchaseError(error);
  }
}

function handlePurchaseError(error) {
  console.error("Purchase error:", error);
  
  if (error.code === 4001) {
    alert("İşlem kullanıcı tarafından iptal edildi");
  } else if (error.message.includes('insufficient funds')) {
    alert("Yetersiz BNB bakiyesi. Lütfen cüzdanınızda yeterli BNB olduğundan emin olun.");
  } else if (error.message.includes('reverted')) {
    alert("Kontrat işlemi reddetti: " + error.reason);
  } else {
    alert("Bir hata oluştu: " + error.message);
  }
}

function showTransactionModal(txHash) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.right = '0';
  modal.style.bottom = '0';
  modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';
  
  modal.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 10px; max-width: 500px;">
      <h2>İşlem Gönderildi!</h2>
      <p>TX Hash: <a href="https://bscscan.com/tx/${txHash}" target="_blank">${txHash.substring(0, 20)}...</a></p>
      <p>Tokenleriniz kısa sürede cüzdanınıza yatacaktır.</p>
      <button onclick="this.parentElement.parentElement.remove()" 
        style="margin-top: 15px; padding: 8px 16px; background: #f6851b; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Tamam
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function redirectToMobile() {
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    window.location.href = 'https://metamask.app.link/dapp/buyfreedogeai.org';
  } else {
    alert("Lütfen işlemlere devam etmek için MetaMask yükleyin");
  }
}

function reloadApp() {
  window.location.reload();
}

// Uygulamayı başlat
window.addEventListener('DOMContentLoaded', () => {
  if (typeof ethers === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.ethers.io/lib/ethers-5.2.umd.min.js';
    script.onload = initDApp;
    document.head.appendChild(script);
  } else {
    initDApp();
  }
});
