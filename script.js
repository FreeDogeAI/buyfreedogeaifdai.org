// CONFIGURATION
const CONFIG = {
    RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
    TOKENS_PER_BNB: 120000000000,
    BSC_CHAIN_ID: 56
};

// STATE
let web3;
let userAddress = "";
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// INIT
window.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupEventListeners();
    checkReturnFromMobile();
    updateConnectButton();
}

// EVENT LISTENERS
function setupEventListeners() {
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('buyBtn').addEventListener('click', sendBNB);
    document.getElementById('bnbAmount').addEventListener('input', calculateFDAI);
}

// META MASK DETECTION
function updateConnectButton() {
    const btn = document.getElementById('connectWalletBtn');
    if (!window.ethereum) {
        btn.textContent = isMobile ? '📱 Open MetaMask' : '⚠️ Install MetaMask';
        btn.onclick = isMobile ? openMobileMetaMask : () => window.open('https://metamask.io/download.html', '_blank');
    }
}

// MAIN CONNECTION FLOW
async function connectWallet() {
    try {
        if (!window.ethereum) {
            if (isMobile) return openMobileMetaMask();
            throw new Error("MetaMask not installed!");
        }

        // Request accounts first
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);

        // Sign message
        await signMessage();

        // Switch network
        await switchToBSC();

        // Update UI
        updateWalletUI();

        // Handle mobile return
        if (isMobile) {
            setTimeout(() => {
                window.location.href = getCleanUrl() + '?mobileSign=true';
            }, 2000);
        }
    } catch (error) {
        console.error("Connection error:", error);
        alert(`Error: ${error.message}`);
    }
}

// MOBILE SPECIFIC FUNCTIONS
function openMobileMetaMask() {
    const deeplink = `https://metamask.app.link/dapp/${getCleanUrl()}?mobileSign=true`;
    console.log("Opening MetaMask with URL:", deeplink); // Debug
    window.location.href = deeplink;
}

function getCleanUrl() {
    return window.location.href.split('?')[0].replace(/^https?:\/\//, '');
}

function checkReturnFromMobile() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mobileSign') === 'true' && window.ethereum?.selectedAddress) {
        completeMobileConnection();
    }
}

async function completeMobileConnection() {
    userAddress = window.ethereum.selectedAddress;
    web3 = new Web3(window.ethereum);
    await switchToBSC();
    updateWalletUI();
    window.history.replaceState({}, document.title, window.location.pathname);
}

// CORE FUNCTIONS
async function signMessage() {
    const message = `FreeDogeAI Connection\n\nAddress: ${userAddress}`;
    await window.ethereum.request({
        method: 'personal_sign',
        params: [message, userAddress]
    });
}

async function switchToBSC() {
    try {
        const chainId = await web3.eth.getChainId();
        if (chainId !== CONFIG.BSC_CHAIN_ID) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }]
            });
        }
    } catch (error) {
        console.error("Network switch failed:", error);
    }
}

function updateWalletUI() {
    const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    document.getElementById('walletAddress').textContent = shortAddress;
    document.getElementById('userTokenAddress').textContent = shortAddress;
    document.getElementById('walletInfo').style.display = 'block';
    document.getElementById('connectWalletBtn').textContent = '✅ Connected';
    document.getElementById('buyBtn').disabled = false;

    // Update balance
    web3.eth.getBalance(userAddress)
        .then(balance => {
            document.getElementById('bnbBalance').textContent = 
                `${parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(6)} BNB`;
        })
        .catch(console.error);
}

// TRANSACTION FUNCTIONS
function calculateFDAI() {
    const amount = parseFloat(document.getElementById('bnbAmount').value) || 0;
    document.getElementById('fdaiAmount').textContent = 
        (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
}

async function sendBNB() {
    const bnbAmount = parseFloat(document.getElementById('bnbAmount').value);
    
    if (!bnbAmount || bnbAmount <= 0) {
        alert("Please enter valid BNB amount!");
        return;
    }

    try {
        const tx = {
            from: userAddress,
            to: CONFIG.RECEIVE_WALLET,
            value: web3.utils.toWei(bnbAmount.toString(), 'ether'),
            gas: 300000,
            gasPrice: await web3.eth.getGasPrice()
        };

        const receipt = await web3.eth.sendTransaction(tx);
        alert(`✅ Success!\nSent: ${bnbAmount} BNB\nReceiving: ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`);
    } catch (error) {
        alert(`Transaction failed: ${error.message}`);
    }
}

// EVENT HANDLERS
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        accounts.length > 0 ? updateWalletUI() : disconnectWallet();
    });

    window.ethereum.on('chainChanged', () => window.location.reload());
}

function disconnectWallet() {
    document.getElementById('walletInfo').style.display = 'none';
    document.getElementById('connectWalletBtn').textContent = '🔗 Connect with MetaMask';
    document.getElementById('buyBtn').disabled = true;
    userAddress = "";
    web3 = null;
}
