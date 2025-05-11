// config.js - Proje ayarları
const CONFIG = {
  TOKEN_NAME: "FreeDogeAI",
  TOKEN_SYMBOL: "FDAI",
  CONTRACT_ADDRESS: "0x8161698A74F2ea0035B9912ED60140893Ac0f39C",
  PRESALE_ADDRESS: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
  TOKEN_DECIMALS: 18,
  PRESALE_RATE: 120000000000, // 1 BNB = 120B FDAI
  CHAIN_ID: 56, // BSC Mainnet
  RPC_URL: "https://bsc-dataseed.binance.org/",
  PRESALE_END: new Date("2023-12-31T23:59:59Z").getTime()
};

// app.js - Ana uygulama mantığı
class PresaleApp {
  constructor() {
    this.web3 = null;
    this.account = null;
    this.bnbBalance = 0;
    this.connected = false;
    this.tokenContract = null;
    
    this.initElements();
    this.initWeb3();
    this.initEventListeners();
    this.updateTimer();
    setInterval(this.updateTimer.bind(this), 1000);
  }

  initElements() {
    this.elements = {
      connectBtn: document.getElementById('connectWallet'),
      buyBtn: document.getElementById('buyTokens'),
      bnbAmount: document.getElementById('bnbAmount'),
      tokenAmount: document.getElementById('tokenAmount'),
      walletAddress: document.getElementById('walletAddress'),
      walletBalance: document.getElementById('walletBalance'),
      countdown: document.getElementById('countdown'),
      progressBar: document.getElementById('progressBar'),
      transactionStatus: document.getElementById('transactionStatus')
    };
  }

  async initWeb3() {
    if (window.ethereum) {
      try {
        this.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.handleAccountsChanged(await this.web3.eth.getAccounts());
        
        window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
        window.ethereum.on('chainChanged', () => window.location.reload());
        
        this.loadContract();
      } catch (error) {
        console.error("Web3 Error:", error);
        this.showError("Cüzdan bağlantısı reddedildi");
      }
    } else {
      this.showError("Lütfen MetaMask yükleyin");
    }
  }

  async loadContract() {
    const ABI = await this.fetchABI();
    this.tokenContract = new this.web3.eth.Contract(ABI, CONFIG.CONTRACT_ADDRESS);
    this.updateUI();
  }

  async fetchABI() {
    // Gerçek projede kontrat ABI'sini burada yükleyin
    return [
      {
        "inputs": [],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ];
  }

  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.showError("Lütfen cüzdan bağlayın");
    } else {
      this.account = accounts[0];
      this.connected = true;
      this.updateAccountInfo();
    }
  }

  async updateAccountInfo() {
    if (!this.connected) return;
    
    try {
      this.bnbBalance = await this.web3.eth.getBalance(this.account);
      const formattedBalance = this.web3.utils.fromWei(this.bnbBalance, 'ether');
      
      this.elements.walletAddress.textContent = `${this.account.substring(0, 6)}...${this.account.substring(38)}`;
      this.elements.walletBalance.textContent = `${parseFloat(formattedBalance).toFixed(4)} BNB`;
    } catch (error) {
      console.error("Balance Error:", error);
    }
  }

  updateTimer() {
    const now = new Date().getTime();
    const distance = CONFIG.PRESALE_END - now;
    
    if (distance < 0) {
      this.elements.countdown.innerHTML = "Ön satış sona erdi";
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    this.elements.countdown.innerHTML = `
      <span>${days}d</span> :
      <span>${hours}h</span> :
      <span>${minutes}m</span> :
      <span>${seconds}s</span>
    `;
  }

  calculateTokens() {
    const bnbValue = parseFloat(this.elements.bnbAmount.value) || 0;
    const tokens = bnbValue * CONFIG.PRESALE_RATE;
    this.elements.tokenAmount.value = tokens.toLocaleString();
  }

  async buyTokens() {
    if (!this.connected) {
      this.showError("Lütfen önce cüzdan bağlayın");
      return;
    }
    
    const bnbAmount = this.elements.bnbAmount.value;
    if (!bnbAmount || isNaN(bnbAmount) {
      this.showError("Geçersiz BNB miktarı");
      return;
    }
    
    try {
      this.elements.transactionStatus.textContent = "İşlem onay bekliyor...";
      this.elements.buyBtn.disabled = true;
      
      const weiAmount = this.web3.utils.toWei(bnbAmount, 'ether');
      
      const tx = await this.tokenContract.methods.buyTokens().send({
        from: this.account,
        value: weiAmount
      });
      
      this.elements.transactionStatus.textContent = `Başarılı! TX Hash: ${tx.transactionHash}`;
      this.updateAccountInfo();
    } catch (error) {
      console.error("Transaction Error:", error);
      this.showError(`İşlem hatası: ${error.message}`);
    } finally {
      this.elements.buyBtn.disabled = false;
    }
  }

  showError(message) {
    this.elements.transactionStatus.textContent = message;
    this.elements.transactionStatus.style.color = "#ff6b6b";
    setTimeout(() => {
      this.elements.transactionStatus.textContent = "";
    }, 5000);
  }

  updateUI() {
    this.elements.connectBtn.style.display = "none";
    this.elements.buyBtn.style.display = "block";
    this.elements.walletAddress.parentElement.style.display = "block";
  }

  initEventListeners() {
    this.elements.connectBtn.addEventListener('click', this.initWeb3.bind(this));
    this.elements.buyBtn.addEventListener('click', this.buyTokens.bind(this));
    this.elements.bnbAmount.addEventListener('input', this.calculateTokens.bind(this));
  }
}

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Web3 !== 'undefined') {
    new PresaleApp();
  } else {
    console.error("Web3 bulunamadı");
  }
});
