// Configuration
const CONFIG = {
    RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
    TOKENS_PER_BNB: 120000000000,
    BSC_CHAIN_ID: 56
};

// App state
let web3;
let userAddress = "";
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkReturnFromMobile();
    detectMetaMask(); // MetaMask varlığını kontrol et
});

// MetaMask yüklü mü kontrolü
function detectMetaMask() {
    if (!window.ethereum) {
        if (isMobile) {
            document.getElementById('connectWalletBtn').textContent = '📱 Open MetaMask App';
        } else {
            document.getElementById('connectWalletBtn').textContent = '⚠️ Install MetaMask';
            document.getElementById('connectWalletBtn').disabled = true;
        }
    }
}

function setupEventListeners() {
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('buyBtn').addEventListener('click', sendBNB);
    document.getElementById('bnbAmount').addEventListener('input', calculateFDAI);
}

// Mobile'den dönüş kontrolü
function checkReturnFromMobile() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mobileSign') === 'true' && window.ethereum?.selectedAddress) {
        completeMobileConnection();
    }
}

// Ana bağlantı fonksiyonu
async function connectWallet() {
    try {
        if (!window.ethereum) {
            if (isMobile) {
                window.location.href = `https://metamask.app.link/dapp/${encodeURIComponent(window.location.href.split('?')[0])}?mobileSign=true`;
                return;
            }
            throw new Error("Please install MetaMask!");
        }

        if (isMobile) {
            await handleMobileConnection();
        } else {
            await handleDesktopConnection();
        }
    } catch (error) {
        console.error("Connection error:", error);
        alert(`Error: ${error.message}`);
    }
}

// Mobil bağlantı akışı
async function handleMobileConnection() {
    // MetaMask uygulamasını aç
    window.location.href = "metamask://";
    
    // Kısa bekleme sonrası işlemleri başlat
    setTimeout(async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);
            
            // İmza isteği
            const message = `FreeDogeAI Wallet Connection\n\nAddress: ${userAddress}\nTimestamp: ${Date.now()}`;
            await window.ethereum.request({
                method: 'personal_sign',
                params: [message, userAddress]
            });
            
            await switchToBSC();
            updateWalletUI();
            
            // 2 saniye sonra geri dön
            setTimeout(() => {
                window.location.href = `${window.location.href.split('?')[0]}?mobileSign=true`;
            }, 2000);
        } catch (error) {
            console.error("Mobile connection failed:", error);
        }
    }, 1000);
}

// Desktop bağlantı akışı
async function handleDesktopConnection() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];
    web3 = new Web3(window.ethereum);
    
    const message = `FreeDogeAI Wallet Connection\n\nAddress: ${userAddress}\nTimestamp: ${Date.now()}`;
    await window.ethereum.request({
        method: 'personal_sign',
        params: [message, userAddress]
    });
    
    await switchToBSC();
    updateWalletUI();
}

// Mobile bağlantı tamamlama
async function completeMobileConnection() {
    userAddress = window.ethereum.selectedAddress;
    web3 = new Web3(window.ethereum);
    await switchToBSC();
    updateWalletUI();
    window.history.replaceState({}, document.title, window.location.pathname);
}

// BSC ağına geçiş
async function switchToBSC() {
    try {
        const chainId = await web3.eth.getChainId();
        if (chainId !== CONFIG.BSC_CHAIN_ID) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }] // BSC Mainnet
            });
        }
    } catch (error) {
        console.error("Network switch failed:", error);
    }
}

// UI güncelleme
function updateWalletUI() {
    const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    document.getElementById('walletAddress').textContent = shortAddress;
    document.getElementById('userTokenAddress').textContent = shortAddress;
    document.getElementById('walletInfo').style.display = 'block';
    document.getElementById('connectWalletBtn').textContent = '✅ Connected';
    document.getElementById('buyBtn').disabled = false;

    // BNB bakiyesini güncelle
    web3.eth.getBalance(userAddress)
        .then(balance => {
            const bnbBalance = web3.utils.fromWei(balance, 'ether');
            document.getElementById('bnbBalance').textContent = `${parseFloat(bnbBalance).toFixed(6)} BNB`;
        })
        .catch(console.error);
}

// FDAI hesaplama
function calculateFDAI() {
    const amount = parseFloat(document.getElementById('bnbAmount').value) || 0;
    document.getElementById('fdaiAmount').textContent = (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
}

// BNB gönderme işlemi
async function sendBNB() {
    const bnbAmount = parseFloat(document.getElementById('bnbAmount').value);
    
    if (!bnbAmount || bnbAmount <= 0) {
        alert("Please enter a valid BNB amount!");
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
        alert(`✅ Success!\n\nSent: ${bnbAmount} BNB\nWill receive: ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`);
    } catch (error) {
        alert(`Transaction failed: ${error.message}`);
    }
}

// Cüzdan değişikliklerini izleme
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);
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
    document.getElementById('connectWalletBtn').textContent = '🔗 Connect with MetaMask';
    document.getElementById('buyBtn').disabled = true;
    userAddress = "";
    web3 = null;
            }
