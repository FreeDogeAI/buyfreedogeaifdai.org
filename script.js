// Configuration
const config = {
  presaleWallet: "0xd924e01c7d319c5B23708Cd622bD1143CD4Fb360", // Your wallet to receive BNB
  tokenContract: "0x8161698A74F2ea0035B9912ED60140893Ac0f39C", // Your token contract
  chainId: 56, // BSC Mainnet (97 for testnet)
  chainName: "Binance Smart Chain",
  rpcUrl: "https://bsc-dataseed.binance.org/",
  tokenDecimals: 18,
  presaleRate: 1000 // Tokens per BNB
};

// DOM Elements
const connectBtn = document.getElementById('connectWalletBtn');
const buyBtn = document.getElementById('buyTokensBtn');
const userAddressDiv = document.getElementById('userAddress');
const statusDiv = document.getElementById('status');
const bnbInput = document.getElementById('bnbAmount');

let web3;
let accounts = [];

// Initialize Web3
async function initWeb3() {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      
      // Check if already connected
      accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        updateUI(accounts[0]);
      }
      
      // Set up event listeners
      window.ethereum.on('accountsChanged', (newAccounts) => {
        accounts = newAccounts;
        updateUI(newAccounts[0] || '');
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      
    } catch (error) {
      showError(error);
    }
  } else {
    showError("MetaMask not installed!");
  }
}

// Connect Wallet
async function connectWallet() {
  try {
    // Request account access
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Verify network
    const chainId = await web3.eth.getChainId();
    if (chainId != config.chainId) {
      await switchNetwork();
    }
    
    updateUI(accounts[0]);
    
  } catch (error) {
    showError(error);
  }
}

// Switch to BSC Network
async function switchNetwork() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${config.chainId.toString(16)}` }],
    });
  } catch (switchError) {
    // If network not added, try adding it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${config.chainId.toString(16)}`,
            chainName: config.chainName,
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18
            },
            rpcUrls: [config.rpcUrl],
            blockExplorerUrls: ['https://bscscan.com/']
          }]
        });
      } catch (addError) {
        showError("Failed to add network");
      }
    } else {
      showError("Failed to switch network");
    }
  }
}

// Buy Tokens
async function buyTokens() {
  const bnbAmount = bnbInput.value;
  if (!bnbAmount || isNaN(bnbAmount) || parseFloat(bnbAmount) <= 0) {
    showError("Please enter a valid BNB amount");
    return;
  }

  try {
    // Convert BNB amount to wei
    const amountWei = web3.utils.toWei(bnbAmount, 'ether');
    
    // Send transaction
    statusDiv.textContent = "⏳ Please confirm transaction in MetaMask...";
    
    const tx = await web3.eth.sendTransaction({
      from: accounts[0],
      to: config.presaleWallet,
      value: amountWei
    });
    
    statusDiv.textContent = `✅ Transaction successful! Hash: ${tx.transactionHash}`;
    
    // Optional: Call your token contract to send tokens
    // await distributeTokens(accounts[0], bnbAmount);
    
  } catch (error) {
    showError(error.message || "Transaction failed");
  }
}

// Update UI after connection
function updateUI(address) {
  userAddressDiv.textContent = `Connected: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  connectBtn.textContent = "Connected";
  connectBtn.disabled = true;
  document.getElementById('presaleSection').style.display = 'block';
  statusDiv.textContent = "✅ Wallet connected!";
}

// Show error
function showError(message) {
  console.error(message);
  statusDiv.textContent = `❌ ${message}`;
  statusDiv.style.color = "red";
}

// Initialize when page loads
window.addEventListener('load', () => {
  initWeb3();
  
  // Event listeners
  connectBtn.addEventListener('click', connectWallet);
  buyBtn.addEventListener('click', buyTokens);
});
