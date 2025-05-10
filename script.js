// Configuration
const CONFIG = {
    RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
    TOKENS_PER_BNB: 120000000000,
    BSC_CHAIN_ID: 56
};

// App state
let web3;
let userAddress = "";
let awaitingSignature = false;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, initializing...");

    // Setup event listeners
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    } else {
        console.error("ERROR: Connect Wallet button not found!");
    }

    const buyBtn = document.getElementById('buyBtn');
    if (buyBtn) {
        buyBtn.addEventListener('click', sendBNB);
    } else {
        console.error("ERROR: Buy button not found!");
    }

    const bnbAmountInput = document.getElementById('bnbAmount');
    if (bnbAmountInput) {
        bnbAmountInput.addEventListener('input', calculateFDAI);
    } else {
        console.error("ERROR: BNB Amount input not found!");
    }

    // Check if returning from MetaMask
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signed') === 'true' && window.ethereum?.selectedAddress) {
        console.log("Returning from MetaMask, completing connection...");
        userAddress = window.ethereum.selectedAddress;
        web3 = new Web3(window.ethereum);
        updateWalletUI();
    }
});

// Wallet connection handler
async function connectWallet() {
    console.log("Attempting to connect wallet...");

    // If on mobile, initiate connection and signature before opening MetaMask app
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        console.log("Mobile device detected, initiating connection...");
        try {
            // Check if MetaMask is available
            if (!window.ethereum) {
                console.error("MetaMask is not available in the browser!");
                alert("MetaMask is not available in this browser. Please ensure MetaMask is installed.");
                return;
            }

            // Request accounts to connect to MetaMask
            console.log("Requesting accounts from MetaMask...");
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);
            console.log("Accounts received, user address:", userAddress);

            // Request a signature to verify the user
            console.log("Requesting signature from user...");
            const message = `Welcome to FreeDogeAI!\n\nPlease sign this message to connect your wallet.\n\nWallet Address: ${userAddress}\nTimestamp: ${Date.now()}`;
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, userAddress]
            });
            console.log("Signature received:", signature);

            // Switch to BSC network
            try {
                const chainId = await web3.eth.getChainId();
                console.log("Current chain ID:", chainId);
                if (chainId !== CONFIG.BSC_CHAIN_ID) {
                    console.log("Switching to BSC Mainnet...");
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }] // BSC Mainnet
                    });
                    console.log("Switched to BSC Mainnet");
                }
            } catch (error) {
                console.error("Network switch failed:", error.message);
            }

            // Update UI after successful signature
            updateWalletUI();

            // Open MetaMask app (only to show the main screen, not the browser)
            const currentUrl = window.location.href;
            const redirectUrl = `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}signed=true`;
            localStorage.setItem('redirectUrl', redirectUrl);
            // Use a more specific deep link to open the main wallet screen
            window.location.href = `metamask://wc?uri=wc:`; // This opens the WalletConnect screen, but we can adjust it
            awaitingSignature = true;

            // Show redirect message
            const redirectMessage = document.getElementById('redirectMessage');
            if (redirectMessage) {
                redirectMessage.style.display = 'block';
                // Automatically return to site after 5 seconds
                setTimeout(() => {
                    returnToSite();
                }, 5000);
            }
        } catch (error) {
            console.error("Connection error:", error.message);
            alert("Failed to connect: " + error.message);
        }
        return;
    }

    // For desktop, proceed with signature in browser
    try {
        console.log("Requesting accounts from MetaMask...");
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);
        console.log("Accounts received, user address:", userAddress);

        // Request a signature to verify the user
        console.log("Requesting signature from user...");
        const message = `Welcome to FreeDogeAI!\n\nPlease sign this message to connect your wallet.\n\nWallet Address: ${userAddress}\nTimestamp: ${Date.now()}`;
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, userAddress]
        });
        console.log("Signature received:", signature);

        // Switch to BSC network
        try {
            const chainId = await web3.eth.getChainId();
            console.log("Current chain ID:", chainId);
            if (chainId !== CONFIG.BSC_CHAIN_ID) {
                console.log("Switching to BSC Mainnet...");
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }] // BSC Mainnet
                });
                console.log("Switched to BSC Mainnet");
            }
        } catch (error) {
            console.error("Network switch failed:", error.message);
        }

        updateWalletUI();
    } catch (error) {
        console.error("Connection error:", error.message);
        alert("Failed to connect: " + error.message);
    }
}

// Update UI after connection
function updateWalletUI() {
    console.log("Updating wallet UI...");
    const walletAddressElement = document.getElementById('walletAddress');
    const userTokenAddressElement = document.getElementById('userTokenAddress');
    const walletInfoElement = document.getElementById('walletInfo');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const buyBtn = document.getElementById('buyBtn');
    const redirectMessage = document.getElementById('redirectMessage');

    if (!walletAddressElement || !userTokenAddressElement || !walletInfoElement || !connectWalletBtn || !buyBtn) {
        console.error("One or more UI elements not found!");
        return;
    }

    const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    walletAddressElement.textContent = shortAddress;
    userTokenAddressElement.textContent = shortAddress;

    walletInfoElement.style.display = 'block';
    connectWalletBtn.textContent = '✅ Connected';
    buyBtn.disabled = false;
    if (redirectMessage) {
        redirectMessage.style.display = 'none';
    }

    web3.eth.getBalance(userAddress).then(balance => {
        const bnbBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('bnbBalance').textContent = `${parseFloat(bnbBalance).toFixed(6)} BNB`;
        console.log("BNB Balance updated:", document.getElementById('bnbBalance').textContent);
    }).catch(error => {
        console.error("Failed to fetch balance:", error.message);
    });
}

// Calculate FDAI tokens
function calculateFDAI() {
    console.log("Calculating FDAI tokens...");
    const bnbAmountInput = document.getElementById('bnbAmount');
    const fdaiAmountElement = document.getElementById('fdaiAmount');

    if (!bnbAmountInput || !fdaiAmountElement) {
        console.error("BNB Amount or FDAI Amount element not found!");
        return;
    }

    const amount = parseFloat(bnbAmountInput.value) || 0;
    fdaiAmountElement.textContent = (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
    console.log("FDAI amount updated:", fdaiAmountElement.textContent);
}

// Send BNB transaction
async function sendBNB() {
    console.log("Sending BNB transaction...");
    const bnbAmountInput = document.getElementById('bnbAmount');
    if (!bnbAmountInput) {
        console.error("BNB Amount input not found!");
        return;
    }

    const bnbAmount = parseFloat(bnbAmountInput.value);
    if (!bnbAmount || bnbAmount <= 0) {
        console.log("Invalid BNB amount entered:", bnbAmount);
        alert("Please enter a valid amount!");
        return;
    }

    if (!web3 || !userAddress) {
        console.error("Wallet not connected!");
        alert("Please connect your wallet first!");
        return;
    }

    try {
        const weiAmount = web3.utils.toWei(bnbAmount.toString(), 'ether');
        console.log("Transaction details - Amount in Wei:", weiAmount);

        const tx = {
            from: userAddress,
            to: CONFIG.RECEIVE_WALLET,
            value: weiAmount,
            gas: 300000,
            gasPrice: await web3.eth.getGasPrice()
        };

        console.log("Sending transaction:", tx);
        const receipt = await web3.eth.sendTransaction(tx);
        console.log("Transaction successful, receipt:", receipt);

        alert(`✅ ${bnbAmount} BNB successfully sent!\n\nYou will receive: ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("Transaction failed:", error.message);
        alert("Transaction failed: " + (error.message || error));
    }
}

// Handle return to site
function returnToSite() {
    console.log("Returning to site...");
    const redirectUrl = localStorage.getItem('redirectUrl');
    if (redirectUrl) {
        window.location.href = redirectUrl;
    }
}

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        console.log("Accounts changed:", accounts);
        if (accounts.length > 0) {
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);
            updateWalletUI();
        } else {
            console.log("Disconnected from MetaMask");
            const walletInfoElement = document.getElementById('walletInfo');
            const connectWalletBtn = document.getElementById('connectWalletBtn');
            const buyBtn = document.getElementById('buyBtn');
            const redirectMessage = document.getElementById('redirectMessage');

            if (walletInfoElement && connectWalletBtn && buyBtn) {
                walletInfoElement.style.display = 'none';
                connectWalletBtn.textContent = '🔗 Connect with MetaMask';
                buyBtn.disabled = true;
                if (redirectMessage) {
                    redirectMessage.style.display = 'none';
                }
                userAddress = "";
                web3 = null;
            }
        }
    });

    window.ethereum.on('chainChanged', () => {
        console.log("Chain changed, reloading page...");
        window.location.reload();
    });
        }
