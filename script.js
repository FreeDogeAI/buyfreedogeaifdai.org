// Config
const CONFIG = {
  BSC_CHAIN_ID: 56,
  FDAI_CONTRACT: "0x8161698A74F2ea0035B9912ED60140893Ac0f39C"
};

// State
let web3;
let userAddress = "";

// Initialize
window.addEventListener('DOMContentLoaded', init);

function init() {
  document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
  document.getElementById('buyBtn').addEventListener('click', sendBNB);
  document.getElementById('bnbAmount').addEventListener('input', calculateFDAI);
  
  // Add FDAI token button
  const addTokenBtn = document.createElement('button');
  addTokenBtn.textContent = '➕ Add FDAI to MetaMask';
  addTokenBtn.onclick = addFDAToken;
  document.querySelector('.info-box').appendChild(addTokenBtn);
}

// Main connection function
async function connectWallet() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isMobile) {
    await connectMobile();
  } else {
    await connectDesktop();
  }
}

// Mobile connection flow
async function connectMobile() {
  try {
    // 1. Open MetaMask app
    window.location.href = "metamask://";
    
    // 2. Wait for app to open
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Check if MetaMask is injected
    if (!window.ethereum) {
      throw new Error("MetaMask not detected after app launch");
    }
    
    // 4. Request accounts
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    userAddress = accounts[0];
    web3 = new Web3(window.ethereum);
    
    // 5. Request signature
    const message = `FreeDogeAI Connection\n\nAddress: ${userAddress}\nTimestamp: ${Date.now()}`;
    await window.ethereum.request({
      method: 'personal_sign',
      params: [message, userAddress]
    });
    
    // 6. Switch to BSC
    await switchToBSC();
    
    // 7. Update UI
    updateWalletUI();
    
  } catch (error) {
    console.error("Mobile connection failed:", error);
    alert("Connection error: " + error.message);
  }
}

// Desktop connection flow
async function connectDesktop() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    userAddress = accounts[0];
    web3 = new Web3(window.ethereum);
    updateWalletUI();
  } catch (error) {
    console.error("Desktop connection error:", error);
  }
}

// Add FDAI token to MetaMask
async function addFDAToken() {
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: CONFIG.FDAI_CONTRACT,
          symbol: 'FDAI',
          decimals: 18,
          image: 'https://freedogeai.github.io/FreeDogeAI-Forge/logo.png'
        }
      }
    });
    
    if (wasAdded) {
      alert("FDAI token successfully added to your wallet!");
    }
  } catch (error) {
    console.error("Token add error:", error);
  }
}

// Other necessary functions
async function switchToBSC() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x38' }] // BSC Mainnet
    });
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

// Transaction functions
function calculateFDAI() {
  const amount = parseFloat(document.getElementById('bnbAmount').value) || 0;
  document.getElementById('fdaiAmount').textContent = 
    (amount * 120000000000).toLocaleString();
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
      to: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
      value: web3.utils.toWei(bnbAmount.toString(), 'ether'),
      gas: 300000,
      gasPrice: await web3.eth.getGasPrice()
    };

    const receipt = await web3.eth.sendTransaction(tx);
    alert(`✅ Success!\nSent: ${bnbAmount} BNB\nReceiving: ${(bnbAmount * 120000000000).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`);
  } catch (error) {
    alert(`Transaction failed: ${error.message}`);
  }
}

// Event listeners for account changes
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length > 0) {
      userAddress = accounts[0];
      updateWalletUI();
    } else {
      document.getElementById('walletInfo').style.display = 'none';
      document.getElementById('connectWalletBtn').textContent = '🔗 Connect with MetaMask';
      document.getElementById('buyBtn').disabled = true;
    }
  });

  window.ethereum.on('chainChanged', () => window.location.reload());
}
